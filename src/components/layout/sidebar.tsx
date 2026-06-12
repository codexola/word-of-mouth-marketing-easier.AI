"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  History,
  Settings,
  MessageSquare,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardLogo } from "@/components/brand/dashboard-logo";
import { useApp } from "@/providers/app-provider";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { t, user } = useApp();

  const navItems = [
    { href: "/dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { href: "/posts", label: t.nav.posts, icon: FileText },
    { href: "/history", label: t.nav.history, icon: History },
    { href: "/reviews", label: t.nav.reviews, icon: MessageSquare },
    { href: "/settings", label: t.nav.settings, icon: Settings },
  ];

  return (
    <aside
      className={cn("dashboard-sidebar", open && "dashboard-sidebar--open")}
      aria-label={t.nav.appName}
    >
      <div className="dashboard-sidebar__brand">
        <div className="d-flex align-items-center justify-content-between gap-2">
          <div className="dashboard-sidebar__brand-logo min-w-0">
            <DashboardLogo className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
            <div className="min-w-0">
              <p className="dashboard-sidebar__brand-title text-truncate">{t.nav.appName}</p>
              <p className="dashboard-sidebar__brand-sub text-truncate">{t.nav.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-link text-body p-0 d-lg-none shrink-0"
            onClick={onClose}
            aria-label={t.common.cancel}
          >
            <X size={22} />
          </button>
        </div>
      </div>

      <nav className="dashboard-sidebar__nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn("dashboard-nav-link", active && "active")}
            >
              <Icon size={20} className="dashboard-nav-icon" />
              <span className="text-truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="dashboard-sidebar__footer">
        <p className="mb-0 fw-semibold text-truncate">{user?.name}</p>
        <p className="mb-0 text-truncate opacity-75">{user?.email}</p>
      </div>
    </aside>
  );
}
