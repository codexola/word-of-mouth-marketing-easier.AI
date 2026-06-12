import { PostStatus } from "@/lib/api";
import { useApp } from "@/providers/app-provider";
import { cn } from "@/lib/utils";

const variantMap: Record<PostStatus, string> = {
  NOT_CREATED: "dash-tag--muted",
  AI_GENERATED: "dash-tag--warning",
  PENDING_REVIEW: "dash-tag--warning",
  APPROVED: "dash-tag--success",
  READY_TO_POST: "dash-tag--success",
  POSTED: "dash-tag--success",
  REJECTED: "dash-tag--danger",
  CANCELLED: "dash-tag--muted",
  ERROR: "dash-tag--danger",
};

export function StatusBadge({ status }: { status: PostStatus }) {
  const { t } = useApp();
  return <span className={cn("dash-tag", variantMap[status])}>{t.status[status]}</span>;
}
