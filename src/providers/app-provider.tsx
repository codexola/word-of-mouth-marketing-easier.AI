"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";
import { translations, type Locale } from "@/lib/i18n/translations";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme === "dark" ? "dark" : "light";
}

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("theme");
  return saved === "dark" ? "dark" : "light";
}

interface AppContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  t: (typeof translations)[Locale];
  user: {
    id?: string;
    name: string;
    email: string;
    role?: string;
    isDeveloperSession?: boolean;
  } | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  canManageUsers: boolean;
  isAdmin: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

const PUBLIC_PATHS = ["/login"];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<Locale>("ja");
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);
  const [user, setUser] = useState<{
    id?: string;
    name: string;
    email: string;
    role?: string;
    isDeveloperSession?: boolean;
  } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    if (savedLocale === "ja" || savedLocale === "en") setLocaleState(savedLocale);
    const savedTheme = readStoredTheme();
    setThemeState(savedTheme);
    applyTheme(savedTheme);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.lang = locale;
    localStorage.setItem("locale", locale);
  }, [locale, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme, hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setAuthLoading(false);
      return;
    }

    setAuthLoading(true);
    api
      .me()
      .then((res) => {
        setUser(res.user);
        localStorage.setItem("sessionUser", JSON.stringify(res.user));
        if (res.user.preferredLocale === "ja" || res.user.preferredLocale === "en") {
          setLocaleState(res.user.preferredLocale);
        }
        if (res.user.preferredTheme === "light" || res.user.preferredTheme === "dark") {
          setThemeState(res.user.preferredTheme);
          applyTheme(res.user.preferredTheme);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("sessionUser");
        setUser(null);
      })
      .finally(() => setAuthLoading(false));
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated || authLoading) return;
    if (!user && !isPublic) router.replace("/login");
    else if (user && isPublic) router.replace("/dashboard");
  }, [hydrated, authLoading, user, isPublic, router]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  const setTheme = useCallback((t: Theme) => {
    applyTheme(t);
    localStorage.setItem("theme", t);
    setThemeState(t);
  }, []);
  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next = current === "light" ? "dark" : "light";
      applyTheme(next);
      localStorage.setItem("theme", next);
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("rememberLogin");
    localStorage.removeItem("sessionUser");
    setUser(null);
    router.replace("/login");
  }, [router]);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const res = await api.me();
      setUser(res.user);
      localStorage.setItem("sessionUser", JSON.stringify(res.user));
      if (res.user.preferredLocale === "ja" || res.user.preferredLocale === "en") {
        setLocaleState(res.user.preferredLocale);
      }
      if (res.user.preferredTheme === "light" || res.user.preferredTheme === "dark") {
        setThemeState(res.user.preferredTheme);
        applyTheme(res.user.preferredTheme);
      }
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  const t = useMemo(() => translations[locale], [locale]);

  const canManageUsers = !!user?.isDeveloperSession;
  const isAdmin = user?.role === "ADMIN" || !!user?.isDeveloperSession;

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      theme,
      setTheme,
      toggleTheme,
      t,
      user,
      isAuthenticated: !!user,
      authLoading,
      canManageUsers,
      isAdmin,
      logout,
      refreshUser,
    }),
    [locale, setLocale, theme, setTheme, toggleTheme, t, user, authLoading, canManageUsers, isAdmin, logout, refreshUser]
  );

  const isLoginPage = pathname.startsWith("/login");

  if (!hydrated) {
    if (isLoginPage) {
      return (
        <AppContext.Provider
          value={{
            locale: "ja",
            setLocale: () => {},
            theme: "light",
            setTheme: () => {},
            toggleTheme: () => {},
            t: translations.ja,
            user: null,
            isAuthenticated: false,
            authLoading: false,
            canManageUsers: false,
            isAdmin: false,
            logout: () => {},
            refreshUser: async () => {},
          }}
        >
          {children}
        </AppContext.Provider>
      );
    }
    return (
      <div className="flex h-screen items-center justify-center bg-background text-muted-foreground">
        ...
      </div>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
