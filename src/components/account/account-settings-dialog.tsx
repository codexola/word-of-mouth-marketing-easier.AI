"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, User, Moon, Sun, Languages } from "lucide-react";
import { useApp } from "@/providers/app-provider";
import { api, ApiError } from "@/lib/api";
import { FlowStepBanner } from "@/components/dashboard/flow-step-banner";
import { FlowPageAssets } from "@/components/dashboard/flow-page-assets";
import { FLOW_IMAGES, PAGE_FLOW_STEPS } from "@/lib/flow-images";

interface AccountSettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AccountSettingsDialog({ open, onClose }: AccountSettingsDialogProps) {
  const { t, user, theme, setTheme, locale, setLocale, refreshUser } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !user) return;
    setName(user.name);
    setEmail(user.email);
    setCurrentPassword("");
    setNewPassword("");
    setMessage("");
    setError("");
  }, [open, user]);

  if (!open) return null;

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await api.updateAccount({
        name,
        email,
        currentPassword,
        newPassword: newPassword || undefined,
        preferredLocale: locale,
        preferredTheme: theme,
      });
      localStorage.setItem("token", res.token);
      await refreshUser();
      setMessage(t.account.saved);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.account.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  const isDeveloper = Boolean(user?.isDeveloperSession);

  return (
    <div className="dash-modal-backdrop" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="dash-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dash-modal__header">
          <div className="d-flex align-items-center gap-2">
            <User size={20} className="text-primary" />
            <h2 className="dash-modal__title">{t.account.title}</h2>
          </div>
          <button type="button" className="btn btn-sm btn-link p-0 text-body" onClick={onClose} aria-label={t.common.cancel}>
            <X size={22} />
          </button>
        </div>

        <div className="dash-modal__body">
          <FlowStepBanner steps={PAGE_FLOW_STEPS.account} variant="expansion" />
          <FlowPageAssets page="account" />

          <div className="dash-card--2d p-3 mb-3 text-center" style={{ background: "var(--flow-exp-bg)" }}>
            <Image src={FLOW_IMAGES.team} alt="" width={220} height={100} className="img-fluid mb-2" unoptimized style={{ maxHeight: "6rem", objectFit: "contain" }} />
            <p className="small text-muted mb-0">{t.flow.expansionSteps[2].desc}</p>
          </div>

          {isDeveloper && (
            <div className="dash-alert dash-alert--warning mb-3">{t.account.developerNote}</div>
          )}

          <div className="dash-form-section">
            <p className="dash-form-section__title">{t.account.profile}</p>
            <div className="dash-form-grid">
              <div>
                <label className="dash-label">{t.account.displayName}</label>
                <input className="dash-input" value={name} onChange={(e) => setName(e.target.value)} disabled={isDeveloper} />
              </div>
              <div>
                <label className="dash-label">{t.auth.email}</label>
                <input type="email" className="dash-input" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isDeveloper} />
              </div>
              {!isDeveloper && (
                <>
                  <div>
                    <label className="dash-label">{t.account.currentPassword}</label>
                    <input type="password" className="dash-input" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                  </div>
                  <div>
                    <label className="dash-label">{t.account.newPassword}</label>
                    <input type="password" className="dash-input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={t.account.newPasswordHint} />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="dash-form-section">
            <p className="dash-form-section__title">{t.account.appearance}</p>
            <div className="mb-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Languages size={16} className="text-primary" />
                <span className="small fw-semibold">{t.theme.language}</span>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <button type="button" className={`dash-btn dash-btn--sm ${locale === "ja" ? "dash-btn--primary" : "dash-btn--outline"}`} onClick={() => setLocale("ja")}>日本語</button>
                <button type="button" className={`dash-btn dash-btn--sm ${locale === "en" ? "dash-btn--primary" : "dash-btn--outline"}`} onClick={() => setLocale("en")}>EN</button>
              </div>
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Moon size={16} className="text-primary" />
                <span className="small fw-semibold">{t.account.theme}</span>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <button type="button" className={`dash-btn dash-btn--sm ${theme === "light" ? "dash-btn--primary" : "dash-btn--outline"}`} onClick={() => setTheme("light")}>
                  <Sun size={14} />{t.theme.light}
                </button>
                <button type="button" className={`dash-btn dash-btn--sm ${theme === "dark" ? "dash-btn--primary" : "dash-btn--outline"}`} onClick={() => setTheme("dark")}>
                  <Moon size={14} />{t.theme.dark}
                </button>
              </div>
            </div>
          </div>

          {error && <div className="dash-alert dash-alert--danger mt-2">{error}</div>}
          {message && <div className="dash-alert dash-alert--success mt-2">{message}</div>}
        </div>

        <div className="dash-modal__footer">
          <button type="button" className="dash-btn dash-btn--outline" onClick={onClose}>{t.common.cancel}</button>
          <button type="button" className="dash-btn dash-btn--primary" onClick={handleSave} disabled={saving || isDeveloper}>
            {saving ? t.common.loading : t.common.save}
          </button>
        </div>
      </div>
    </div>
  );
}
