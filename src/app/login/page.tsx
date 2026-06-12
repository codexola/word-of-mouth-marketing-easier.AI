"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Noto_Sans_JP } from "next/font/google";
import { api, ApiError } from "@/lib/api";
import { useApp } from "@/providers/app-provider";
import "@/styles/login.css";

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export default function LoginPage() {
  const router = useRouter();
  const { t, authLoading, refreshUser } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [requiresCode, setRequiresCode] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const completeLogin = async (token: string) => {
    localStorage.setItem("token", token);
    if (remember) localStorage.setItem("rememberLogin", "1");
    else localStorage.removeItem("rememberLogin");
    await refreshUser();
    router.push("/dashboard");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.login(email, password, requiresCode ? code : undefined);

      if (res.requiresCode) {
        setRequiresCode(true);
        setError("");
        return;
      }

      if (!res.token) {
        setError(t.auth.loginFailed);
        return;
      }

      await completeLogin(res.token);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.auth.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        {t.common.loading}
      </div>
    );
  }

  return (
    <div className={`login-page ${notoSansJp.className}`}>
      <Image
        src="/login-page-bg.png"
        alt=""
        fill
        className="login-page__bg"
        priority
        unoptimized
        sizes="100vw"
      />
      <div className="login-page__overlay" aria-hidden />

      <div className="login-page__shell">
        <div className="login-page__card" role="dialog" aria-labelledby="login-title">
          <div className="login-page__logo" id="login-title">
            <Image
              src="/logo.png"
              alt={t.login.productName}
              width={120}
              height={120}
              className="login-page__logo-img"
              priority
              unoptimized
            />
          </div>

          <p className="login-page__heading">{t.login.pageTitle}</p>
          <p className="login-page__subtitle">{t.login.productSubtitle}</p>

          <form onSubmit={handleLogin} className="login-page__form">
            <div className="login-page__field">
              <label htmlFor="email" className="login-page__label">{t.auth.email}</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="login-page__input"
                placeholder={t.login.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={requiresCode}
              />
            </div>

            <div className="login-page__field">
              <label htmlFor="password" className="login-page__label">{t.auth.password}</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="login-page__input"
                placeholder={t.login.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={requiresCode}
              />
            </div>

            {requiresCode && (
              <div className="login-page__field">
                <label htmlFor="code" className="login-page__label">{t.auth.loginCode}</label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  autoComplete="one-time-code"
                  className="login-page__input login-page__input--code"
                  placeholder={t.auth.loginCodePlaceholder}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                />
                <p className="login-page__hint">{t.auth.loginCodeHint}</p>
              </div>
            )}

            {!requiresCode && (
              <div className="login-page__options">
                <label className="login-page__checkbox-label">
                  <input
                    type="checkbox"
                    className="login-page__checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  {t.login.rememberMe}
                </label>
              </div>
            )}

            {error && <p className="login-page__error" role="alert">{error}</p>}

            <button type="submit" className="login-page__submit" disabled={loading}>
              {loading ? t.auth.loggingIn : requiresCode ? t.auth.verifyCode : t.auth.login}
            </button>

            {requiresCode && (
              <button
                type="button"
                className="login-page__link w-full text-center mt-2"
                onClick={() => {
                  setRequiresCode(false);
                  setCode("");
                  setError("");
                }}
              >
                {t.auth.backToLogin}
              </button>
            )}
          </form>

          <footer className="login-page__footer">
            <p className="login-page__copyright">{t.login.copyright}</p>
            <nav className="login-page__legal" aria-label={t.login.legalNav}>
              <button type="button" className="login-page__link" onClick={() => alert(t.login.termsText)}>
                {t.login.terms}
              </button>
              <span className="login-page__legal-sep" aria-hidden>|</span>
              <button type="button" className="login-page__link" onClick={() => alert(t.login.privacyText)}>
                {t.login.privacy}
              </button>
            </nav>
          </footer>
        </div>
      </div>
    </div>
  );
}
