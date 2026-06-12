"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, Save, Check, X, Copy, RotateCcw } from "lucide-react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageCard, PageLoading } from "@/components/layout/page-shell";
import { FlowStepBanner } from "@/components/dashboard/flow-step-banner";
import { FlowPageAssets } from "@/components/dashboard/flow-page-assets";
import { PAGE_FLOW_STEPS } from "@/lib/flow-images";
import { StatusBadge } from "@/components/posts/status-badge";
import { api, PostCandidateDetail } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useApp } from "@/providers/app-provider";

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { t, isAuthenticated, authLoading } = useApp();
  const [post, setPost] = useState<PostCandidateDetail | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  const loadPost = async () => {
    const data = await api.getPost(id);
    setPost(data);
    setTitle(data.generation?.title || "");
    setBody(data.generation?.body || "");
  };

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    loadPost()
      .catch(() => router.push("/posts"))
      .finally(() => setLoading(false));
  }, [id, router, authLoading, isAuthenticated]);

  const runAction = async (action: string, fn: () => Promise<unknown>) => {
    setActionLoading(action);
    try {
      await fn();
      await loadPost();
    } catch {
      alert(t.postDetail.actionFailed);
    } finally {
      setActionLoading("");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${title}\n\n${body}`);
    alert(t.postDetail.copyDone);
  };

  if (loading || !post) {
    return (
      <DashboardLayout>
        <PageLoading />
      </DashboardLayout>
    );
  }

  const isCancelled = post.status === "CANCELLED";
  const isError = post.status === "ERROR";
  const isLocked = ["APPROVED", "POSTED", "CANCELLED"].includes(post.status);
  const isRejected = post.status === "REJECTED";
  const lockedStatus =
    post.status === "CANCELLED" ? t.status.CANCELLED : t.status.APPROVED;

  return (
    <DashboardLayout>
      <div className="dash-page">
        <div className="dash-page-header">
          <div className="d-flex align-items-center gap-3 min-w-0">
            <Link href="/posts" className="dash-btn dash-btn--outline dash-btn--sm">
              <ArrowLeft size={16} />
            </Link>
            <div className="min-w-0">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <h1 className="dash-page-title mb-0">{t.postDetail.title}</h1>
                <StatusBadge status={post.status} />
              </div>
              <p className="dash-page-subtitle">
                {t.source[post.source]} ・ {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <FlowStepBanner steps={PAGE_FLOW_STEPS.posts} variant="mvp" />
        <FlowPageAssets page="postDetail" />

        <div className="row g-3 g-lg-4">
          <div className="col-12 col-lg-6">
            <PageCard title={t.postDetail.photos}>
              {post.images.length > 0 ? (
                <div className="row g-2">
                  {post.images.map((img) => (
                    <div key={img.id} className="col-6">
                      <div className="position-relative rounded overflow-hidden border" style={{ aspectRatio: "1", borderColor: "var(--bs-border-color)", borderWidth: "2px", boxShadow: "0 3px 0 #dbeafe" }}>
                        <Image src={img.url} alt={img.fileName || ""} fill className="object-cover" unoptimized />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="dash-empty">{t.postDetail.noPhotos}</p>
              )}
              {post.memo && (
                <div className="dash-card--2d p-3 mt-3">
                  <p className="small fw-bold mb-1">{t.postDetail.memo}</p>
                  <p className="small text-muted mb-0" style={{ whiteSpace: "pre-wrap" }}>{post.memo}</p>
                </div>
              )}
              <div className="dash-form-grid dash-form-grid--2 mt-3 small">
                <div><span className="text-muted">{t.posts.region}:</span> {post.region || "-"}</div>
                <div><span className="text-muted">{t.posts.service}:</span> {post.serviceType || "-"}</div>
                {post.workDescription && (
                  <div style={{ gridColumn: "1 / -1" }}><span className="text-muted">{t.postDetail.workDescription}:</span> {post.workDescription}</div>
                )}
              </div>
            </PageCard>
          </div>

          <div className="col-12 col-lg-6">
            <PageCard title={t.postDetail.edit}>
              {isLocked && (
                <div className="dash-alert dash-alert--info mb-3">
                  {t.postDetail.locked.replace("{status}", lockedStatus)}
                  {post.approvedPost && (
                    <Link href="/history" className="dash-link ms-1">{t.postDetail.viewHistory}</Link>
                  )}
                </div>
              )}
              {isRejected && (
                <div className="dash-alert dash-alert--warning mb-3">{t.postDetail.regenerateFromReject}</div>
              )}
              {isError && (
                <div className="dash-alert dash-alert--danger mb-3">{t.postDetail.errorRetryHint}</div>
              )}
              {post.errorMessage && (
                <div className="dash-alert dash-alert--warning mb-3">{t.postDetail.errorMessage}: {post.errorMessage}</div>
              )}
              <div className="dash-form-grid">
                <div>
                  <label className="dash-label">{t.postDetail.postTitle}</label>
                  <input className="dash-input" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isLocked} />
                </div>
                <div>
                  <label className="dash-label">{t.postDetail.postBody}</label>
                  <textarea className="dash-textarea" value={body} onChange={(e) => setBody(e.target.value)} rows={10} disabled={isLocked} />
                </div>
                {post.generation?.shortBody && (
                  <div className="dash-card--2d p-3 small">
                    <p className="fw-bold mb-1">{t.postDetail.shortBody}</p>
                    <p className="text-muted mb-0">{post.generation.shortBody}</p>
                  </div>
                )}
                {post.generation?.politeBody && (
                  <div className="dash-card--2d p-3 small">
                    <p className="fw-bold mb-1">{t.postDetail.politeBody}</p>
                    <p className="text-muted mb-0">{post.generation.politeBody}</p>
                  </div>
                )}
                {post.generation?.regionalBody && (
                  <div className="dash-card--2d p-3 small">
                    <p className="fw-bold mb-1">{t.postDetail.regionalBody}</p>
                    <p className="text-muted mb-0">{post.generation.regionalBody}</p>
                  </div>
                )}
                {post.generation?.serviceKeywords && post.generation.serviceKeywords.length > 0 && (
                  <div className="small">
                    <span className="fw-bold">{t.postDetail.serviceKeywords}: </span>
                    {post.generation.serviceKeywords.join("、")}
                  </div>
                )}
                {post.generation?.cautions && (
                  <div className="dash-alert dash-alert--warning">{t.postDetail.caution}: {post.generation.cautions}</div>
                )}
                <div className="d-flex flex-wrap gap-2">
                  {isCancelled && (
                    <button type="button" className="dash-btn dash-btn--success dash-btn--sm" onClick={() => runAction("restore", () => api.restorePost(id))} disabled={!!actionLoading}>
                      <RotateCcw size={14} />
                      {actionLoading === "restore" ? t.postDetail.restoring : t.postDetail.restore}
                    </button>
                  )}
                  {isError && (
                    <button type="button" className="dash-btn dash-btn--primary dash-btn--sm" onClick={() => runAction("regenerate", () => api.generatePost(id))} disabled={!!actionLoading}>
                      <RefreshCw size={14} />
                      {actionLoading === "regenerate" ? t.postDetail.regenerating : t.postDetail.retryGenerate}
                    </button>
                  )}
                  {isRejected && (
                    <>
                      <button type="button" className="dash-btn dash-btn--outline dash-btn--sm" onClick={() => runAction("regenerate", () => api.generatePost(id))} disabled={!!actionLoading}>
                        <RefreshCw size={14} />
                        {actionLoading === "regenerate" ? t.postDetail.regenerating : t.postDetail.regenerate}
                      </button>
                      <button type="button" className="dash-btn dash-btn--outline dash-btn--sm" onClick={() => runAction("save", () => api.updatePostContent(id, { title, body }))} disabled={!!actionLoading}>
                        <Save size={14} />
                        {actionLoading === "save" ? t.postDetail.saving : t.common.save}
                      </button>
                    </>
                  )}
                  {!isLocked && !isRejected && (
                    <>
                      <button type="button" className="dash-btn dash-btn--outline dash-btn--sm" onClick={() => runAction("regenerate", () => api.generatePost(id))} disabled={!!actionLoading}>
                        <RefreshCw size={14} />
                        {actionLoading === "regenerate" ? t.postDetail.regenerating : t.postDetail.regenerate}
                      </button>
                      <button type="button" className="dash-btn dash-btn--outline dash-btn--sm" onClick={() => runAction("save", () => api.updatePostContent(id, { title, body }))} disabled={!!actionLoading}>
                        <Save size={14} />
                        {actionLoading === "save" ? t.postDetail.saving : t.common.save}
                      </button>
                      <button type="button" className="dash-btn dash-btn--success dash-btn--sm" onClick={() => runAction("approve", () => api.approvePost(id))} disabled={!!actionLoading || !title || !body}>
                        <Check size={14} />
                        {actionLoading === "approve" ? t.postDetail.approving : t.postDetail.approve}
                      </button>
                      <button
                        type="button"
                        className="dash-btn dash-btn--outline dash-btn--sm"
                        onClick={() => {
                          const reason = window.prompt(t.postDetail.rejectReason) ?? undefined;
                          runAction("reject", () => api.rejectPost(id, reason));
                        }}
                        disabled={!!actionLoading}
                      >
                        <X size={14} />
                        {actionLoading === "reject" ? t.postDetail.rejecting : t.postDetail.reject}
                      </button>
                      <button type="button" className="dash-btn dash-btn--danger dash-btn--sm" onClick={() => runAction("cancel", () => api.cancelPost(id))} disabled={!!actionLoading}>
                        <X size={14} />
                        {actionLoading === "cancel" ? t.postDetail.cancelling : t.postDetail.cancelAd}
                      </button>
                    </>
                  )}
                  <button type="button" className="dash-btn dash-btn--outline dash-btn--sm" onClick={copyToClipboard}>
                    <Copy size={14} />
                    {t.common.copy}
                  </button>
                </div>
              </div>
            </PageCard>
          </div>
        </div>

        {post.editHistories && post.editHistories.length > 0 && (
          <PageCard title={t.postDetail.editHistory}>
            <div className="d-flex flex-column gap-2">
              {post.editHistories.map((h) => (
                <div key={h.id} className="dash-card--2d p-3 small">
                  <div className="d-flex justify-content-between text-muted mb-1">
                    <span>{h.action} {h.user?.name && `by ${h.user.name}`}</span>
                    <span>{formatDate(h.createdAt)}</span>
                  </div>
                  <p className="fw-semibold mb-0">{h.title}</p>
                </div>
              ))}
            </div>
          </PageCard>
        )}
      </div>
    </DashboardLayout>
  );
}
