import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("dash-page-header", className)}>
      <div className="min-w-0">
        <h1 className="dash-page-title">{title}</h1>
        {subtitle && <p className="dash-page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="dash-page-actions">{actions}</div>}
    </div>
  );
}

interface PageCardProps {
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  variant?: "flat" | "elevated";
  headerActions?: React.ReactNode;
}

export function PageCard({
  title,
  subtitle,
  badge,
  children,
  className,
  variant = "elevated",
  headerActions,
}: PageCardProps) {
  return (
    <div className={cn("dash-card", variant === "elevated" ? "dash-card--3d" : "dash-card--2d", className)}>
      {(title || headerActions) && (
        <div className="dash-card__header">
          <div className="min-w-0">
            {title && (
              <h2 className="dash-card__title">
                {title}
                {badge}
              </h2>
            )}
            {subtitle && <p className="dash-card__subtitle">{subtitle}</p>}
          </div>
          {headerActions}
        </div>
      )}
      <div className="dash-card__body">{children}</div>
    </div>
  );
}

export function PageFilterBar({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("dash-filter-bar dash-card--2d", className)}>{children}</div>;
}

export function PageLoading() {
  return (
    <div className="dash-loading">
      <div className="spinner-border text-primary" role="status" />
    </div>
  );
}

export function PageEmpty({ message }: { message: string }) {
  return <p className="dash-empty">{message}</p>;
}
