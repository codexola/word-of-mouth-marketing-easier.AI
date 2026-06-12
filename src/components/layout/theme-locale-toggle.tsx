"use client";

import { Moon, Sun, Languages } from "lucide-react";
import { useApp } from "@/providers/app-provider";
import { Button } from "@/components/ui/button";

export function ThemeLocaleToggle() {
  const { locale, setLocale, theme, toggleTheme, t } = useApp();

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 border-2 border-border bg-card p-1">
        <Languages className="ml-1 h-4 w-4 text-foreground" />
        <Button
          variant={locale === "ja" ? "default" : "ghost"}
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => setLocale("ja")}
        >
          日本語
        </Button>
        <Button
          variant={locale === "en" ? "default" : "ghost"}
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => setLocale("en")}
        >
          EN
        </Button>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleTheme}
        className="gap-2"
        title={theme === "light" ? t.theme.dark : t.theme.light}
        aria-label={theme === "light" ? t.theme.dark : t.theme.light}
      >
        {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        {theme === "light" ? t.theme.dark : t.theme.light}
      </Button>
    </div>
  );
}
