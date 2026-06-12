"use client";

import { useState } from "react";
import { LogOut, Menu, Settings, Users } from "lucide-react";
import { Sidebar } from "./sidebar";
import { DashboardLogo } from "@/components/brand/dashboard-logo";
import { AccountSettingsDialog } from "@/components/account/account-settings-dialog";
import { DeveloperUserManagementDialog } from "@/components/account/developer-user-management-dialog";
import { useApp } from "@/providers/app-provider";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, authLoading, isAuthenticated, isAdmin, canManageUsers, logout, t } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [developerOpen, setDeveloperOpen] = useState(false);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="d-flex min-vh-100 align-items-center justify-content-center text-muted">
        <div className="spinner-border spinner-border-sm me-2 text-primary" role="status" />
        {t.common.loading}
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="d-flex min-vh-100 align-items-center justify-content-center p-4" style={{ background: "var(--flow-mvp-bg)" }}>
        <div className="dash-card--3d p-4 p-md-5 text-center" style={{ maxWidth: "28rem" }}>
          <h1 className="h4 fw-bold mb-3">{t.accessDenied.title}</h1>
          <p className="text-muted mb-4">{t.accessDenied.message}</p>
          <button type="button" className="dash-btn dash-btn--primary" onClick={logout}>
            <LogOut size={16} />
            {t.accessDenied.logout}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-app d-flex w-100 overflow-x-hidden">
      {sidebarOpen && (
        <button
          type="button"
          className="position-fixed top-0 start-0 w-100 h-100 border-0 d-lg-none"
          style={{ zIndex: 1040, background: "rgba(15, 23, 42, 0.45)" }}
          onClick={() => setSidebarOpen(false)}
          aria-label={t.common.cancel}
        />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-shell">
        <header className="dashboard-header d-flex flex-wrap align-items-center justify-content-between gap-2 px-2 px-sm-3 py-2">
          <div className="d-flex align-items-center gap-2 min-w-0 flex-grow-1">
            <button
              type="button"
              className="btn btn-primary btn-sm d-lg-none dashboard-btn-primary"
              onClick={() => setSidebarOpen(true)}
              aria-label="Menu"
            >
              <Menu size={18} />
            </button>
            <DashboardLogo className="d-lg-none h-8 w-8 shrink-0" />
            <p className="d-none d-sm-block mb-0 small text-muted text-truncate">
              {t.auth.welcome}
              <span className="fw-semibold text-primary">{user?.name}</span>
              {t.auth.welcomeSuffix}
            </p>
          </div>

          <div className="d-flex align-items-center gap-1 gap-sm-2 shrink-0">
            {canManageUsers && (
              <button
                type="button"
                className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 fw-semibold"
                onClick={() => setDeveloperOpen(true)}
              >
                <Users size={16} />
                <span className="d-none d-md-inline">{t.developer.shortTitle}</span>
              </button>
            )}
            <button
              type="button"
              className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 fw-semibold"
              onClick={() => setAccountOpen(true)}
            >
              <Settings size={16} />
              <span className="d-none d-sm-inline">{t.account.title}</span>
            </button>
            <button
              type="button"
              className="btn btn-sm d-flex align-items-center gap-1 dashboard-btn-primary"
              onClick={logout}
            >
              <LogOut size={16} />
              <span className="d-none d-sm-inline">{t.nav.logout}</span>
            </button>
          </div>
        </header>

        <main className="dashboard-main">{children}</main>
      </div>

      <AccountSettingsDialog open={accountOpen} onClose={() => setAccountOpen(false)} />
      {canManageUsers && (
        <DeveloperUserManagementDialog open={developerOpen} onClose={() => setDeveloperOpen(false)} />
      )}
    </div>
  );
}
