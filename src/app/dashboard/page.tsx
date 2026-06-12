"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DashboardIcon } from "@/components/icons/dashboard-icon";
import { DashboardSvgIcon, type DashboardIconName } from "@/components/icons/svg-icons";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader, PageCard } from "@/components/layout/page-shell";
import { PostListTable } from "@/components/posts/post-list-table";
import { PostReviewModal } from "@/components/posts/post-review-modal";
import { ProjectFlowRoadmap } from "@/components/dashboard/project-flow-roadmap";
import { FlowStepBanner } from "@/components/dashboard/flow-step-banner";
import { FlowPageAssets } from "@/components/dashboard/flow-page-assets";
import { PAGE_FLOW_STEPS } from "@/lib/flow-images";
import { api, PostCandidate } from "@/lib/api";
import { useApp } from "@/providers/app-provider";

const POLL_INTERVAL_MS = 8000;

export default function DashboardPage() {
  const { t, isAuthenticated, authLoading } = useApp();
  const [stats, setStats] = useState<Record<string, number>>({});
  const [recentPosts, setRecentPosts] = useState<PostCandidate[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [reviewPost, setReviewPost] = useState<PostCandidate | null>(null);
  const [modalLoading, setModalLoading] = useState<string | null>(null);
  const dismissedIds = useRef<Set<string>>(new Set());

  const refreshDashboard = useCallback(async () => {
    let newStats = await api.getStats();
    if (newStats.errors > 0) {
      await api.repairErrorPosts().catch(() => {});
      newStats = await api.getStats();
    }
    const [newPosts, pending] = await Promise.all([
      api.getPosts({ limit: "8" }),
      api.getPosts({ status: "PENDING_REVIEW", limit: "10" }),
    ]);
    setStats(newStats);
    setRecentPosts(newPosts.items);

    const nextReview = pending.items.find((p) => !dismissedIds.current.has(p.id));
    if (nextReview?.generation) {
      setReviewPost((current) => {
        if (current?.id === nextReview.id) {
          return { ...current, generation: nextReview.generation, images: nextReview.images };
        }
        return nextReview;
      });
    } else if (!modalLoading) {
      setReviewPost(null);
    }
  }, [modalLoading]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    refreshDashboard().catch(() => {});
    const interval = setInterval(() => refreshDashboard().catch(() => {}), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [authLoading, isAuthenticated, refreshDashboard]);

  const statCards: { key: string; label: string; icon: DashboardIconName; href: string }[] = [
    { key: "pendingReview", label: t.dashboard.stats.pendingReview, icon: "ai", href: "/posts?status=PENDING_REVIEW" },
    { key: "aiGenerated", label: t.dashboard.stats.aiGenerated, icon: "upload", href: "/posts?status=NOT_CREATED" },
    { key: "readyToPost", label: t.dashboard.stats.readyToPost, icon: "gbp", href: "/history?status=READY_TO_POST" },
    { key: "posted", label: t.dashboard.stats.posted, icon: "send", href: "/history?status=POSTED" },
    { key: "errors", label: t.dashboard.stats.errors, icon: "edit", href: "/posts?status=ERROR" },
    { key: "reviewScheduled", label: t.dashboard.stats.reviewScheduled, icon: "reviews", href: "/reviews?status=SCHEDULED" },
    { key: "cancelled", label: t.dashboard.stats.cancelled, icon: "upload", href: "/posts?status=CANCELLED" },
  ];

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await api.syncDrive();
      alert(t.dashboard.syncDone.replace("{count}", String(result.synced)));
      await refreshDashboard();
    } catch {
      alert(t.dashboard.syncFailed);
    } finally {
      setSyncing(false);
    }
  };

  const closeModal = (postId: string) => {
    dismissedIds.current.add(postId);
    setReviewPost(null);
  };

  const handleApprove = async () => {
    if (!reviewPost) return;
    setModalLoading("approve");
    try {
      await api.approvePost(reviewPost.id);
      closeModal(reviewPost.id);
      await refreshDashboard();
    } catch {
      alert(t.reviewModal.actionFailed);
    } finally {
      setModalLoading(null);
    }
  };

  const handleReject = async () => {
    if (!reviewPost) return;
    setModalLoading("reject");
    try {
      await api.rejectPost(reviewPost.id);
      closeModal(reviewPost.id);
      await refreshDashboard();
    } catch {
      alert(t.reviewModal.actionFailed);
    } finally {
      setModalLoading(null);
    }
  };

  const handleRegenerate = async () => {
    if (!reviewPost) return;
    setModalLoading("regenerate");
    try {
      await api.generatePost(reviewPost.id);
      const updated = await api.getPost(reviewPost.id);
      setReviewPost(updated);
      await refreshDashboard();
    } catch {
      alert(t.reviewModal.actionFailed);
    } finally {
      setModalLoading(null);
    }
  };

  const handleCancel = async () => {
    if (!reviewPost) return;
    setModalLoading("cancel");
    try {
      await api.cancelPost(reviewPost.id);
      closeModal(reviewPost.id);
      await refreshDashboard();
    } catch {
      alert(t.reviewModal.actionFailed);
    } finally {
      setModalLoading(null);
    }
  };

  return (
    <DashboardLayout>
      {reviewPost && (
        <PostReviewModal
          post={reviewPost}
          loading={modalLoading}
          onApprove={handleApprove}
          onReject={handleReject}
          onRegenerate={handleRegenerate}
          onCancel={handleCancel}
        />
      )}

      <div className="dash-page">
        <PageHeader
          title={t.dashboard.title}
          subtitle={t.dashboard.subtitle}
          actions={
            <button type="button" className="dash-btn dash-btn--primary" onClick={handleSync} disabled={syncing}>
              <DashboardSvgIcon name="upload" size={18} />
              <span>{syncing ? t.dashboard.syncing : t.dashboard.syncDrive}</span>
            </button>
          }
        />

        <FlowStepBanner steps={PAGE_FLOW_STEPS.dashboard} variant="mvp" />
        <FlowPageAssets page="dashboard" />

        <ProjectFlowRoadmap />

        <div className="row g-3">
          {statCards.map((card) => (
            <div key={card.key} className="col-6 col-md-4 col-xl-3">
              <Link href={card.href} className="dashboard-stat-card d-block h-100 text-decoration-none">
                <div className="d-flex align-items-center gap-3 p-3">
                  <DashboardIcon name={card.icon} alt={card.label} size={32} />
                  <div className="min-w-0">
                    <p className="h4 fw-bold mb-0 text-primary">{stats[card.key] ?? 0}</p>
                    <p className="small text-muted mb-0 text-truncate">{card.label}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <PageCard
          title={t.dashboard.recentPosts}
          subtitle={t.dashboard.recentDesc}
          headerActions={
            <Link href="/posts" className="dash-btn dash-btn--outline dash-btn--sm">
              {t.dashboard.viewAll}
              <ArrowRight size={14} />
            </Link>
          }
        >
          {recentPosts.length === 0 ? (
            <p className="dash-empty">{t.dashboard.noPosts}</p>
          ) : (
            <PostListTable posts={recentPosts} />
          )}
        </PageCard>
      </div>
    </DashboardLayout>
  );
}
