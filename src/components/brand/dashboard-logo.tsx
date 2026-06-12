import { DashboardLogoImage } from "@/components/icons/dashboard-icon";

export function DashboardLogo({ className }: { className?: string }) {
  return (
    <DashboardLogoImage
      alt="投稿サポート for Gビジネス"
      className={className ?? "h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"}
    />
  );
}
