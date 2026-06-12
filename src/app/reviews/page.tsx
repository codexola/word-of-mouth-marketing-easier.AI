"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, RefreshCw, Copy, CheckCircle, XCircle, Save, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader, PageCard, PageLoading, PageEmpty, PageFilterBar } from "@/components/layout/page-shell";
import { FlowStepBanner } from "@/components/dashboard/flow-step-banner";
import { FlowPageAssets } from "@/components/dashboard/flow-page-assets";
import { PAGE_FLOW_STEPS } from "@/lib/flow-images";
import { api, ReviewRequest } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useApp } from "@/providers/app-provider";

const statusTag: Record<ReviewRequest["sendStatus"], string> = {
  DRAFT: "dash-tag--muted",
  SCHEDULED: "dash-tag--warning",
  SENT: "dash-tag--success",
  CANCELLED: "dash-tag--danger",
};

function ReviewsContent() {
  const { t, isAuthenticated, authLoading } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const statusFilter = searchParams.get("status") || "";
  const [reviews, setReviews] = useState<ReviewRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    completionDate: "",
    scheduledSendDate: "",
    reviewUrl: "",
    lineUserId: "",
    customerEmail: "",
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState({ thankMessage: "", reviewMessage: "", followUpMessage: "" });
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadReviews = () => {
    if (!isAuthenticated) return;
    api
      .getReviews({ ...(statusFilter && { status: statusFilter }) })
      .then((res) => setReviews(res.items))
      .catch(() => {});
  };

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    loadReviews();
  }, [statusFilter, authLoading, isAuthenticated]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createReview({
        customerName: form.customerName,
        completionDate: form.completionDate,
        scheduledSendDate: form.scheduledSendDate || undefined,
        reviewUrl: form.reviewUrl || undefined,
        lineUserId: form.lineUserId || undefined,
        customerEmail: form.customerEmail || undefined,
      });
      setForm({ customerName: "", completionDate: "", scheduledSendDate: "", reviewUrl: "", lineUserId: "", customerEmail: "" });
      setShowForm(false);
      loadReviews();
    } catch {
      alert(t.reviews.registerFailed);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (review: ReviewRequest) => {
    setEditingId(review.id);
    setEditDraft({
      thankMessage: review.thankMessage || "",
      reviewMessage: review.reviewMessage || "",
      followUpMessage: review.followUpMessage || "",
    });
  };

  const saveEdit = async (id: string) => {
    setSavingId(id);
    try {
      await api.updateReview(id, editDraft);
      setEditingId(null);
      loadReviews();
    } catch {
      alert(t.reviews.updateFailed);
    } finally {
      setSavingId(null);
    }
  };

  const markSent = async (id: string) => {
    try {
      await api.updateReview(id, { sendStatus: "SENT" });
      alert(t.reviews.sentDone);
      loadReviews();
    } catch {
      alert(t.reviews.updateFailed);
    }
  };

  const markCancelled = async (review: ReviewRequest) => {
    const msg = t.reviews.confirmCancel.replace("{name}", review.customerName);
    if (!window.confirm(msg)) return;
    try {
      await api.updateReview(review.id, { sendStatus: "CANCELLED" });
      loadReviews();
    } catch {
      alert(t.reviews.updateFailed);
    }
  };

  const deleteReview = async (review: ReviewRequest) => {
    const msg = t.reviews.confirmDelete.replace("{name}", review.customerName);
    if (!window.confirm(msg)) return;
    try {
      await api.deleteReview(review.id);
      alert(t.reviews.deleted);
      loadReviews();
    } catch {
      alert(t.reviews.deleteFailed);
    }
  };

  const canDeleteReview = (review: ReviewRequest) =>
    review.sendStatus !== "SENT" &&
    !review.thankSentAt &&
    !review.reviewSentAt &&
    !review.followUpSentAt;

  const statusOptions = [
    { value: "", label: t.common.all },
    ...(["DRAFT", "SCHEDULED", "SENT", "CANCELLED"] as const).map((s) => ({
      value: s,
      label: t.reviews.status[s],
    })),
  ];

  return (
    <div className="dash-page">
      <PageHeader
        title={t.reviews.title}
        subtitle={t.reviews.subtitle}
        actions={
          <button type="button" className="dash-btn dash-btn--primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={16} />
            {t.reviews.addNew}
          </button>
        }
      />

      <FlowStepBanner steps={PAGE_FLOW_STEPS.reviews} variant="expansion" />
      <FlowPageAssets page="reviews" />

      <PageFilterBar>
        <select
          className="dash-select w-100 w-sm-auto"
          value={statusFilter}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams.toString());
            if (e.target.value) params.set("status", e.target.value);
            else params.delete("status");
            router.push(`/reviews?${params.toString()}`);
          }}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </PageFilterBar>

      {showForm && (
        <PageCard title={t.reviews.addNew} variant="flat">
          <form onSubmit={handleCreate} className="dash-form-grid dash-form-grid--2">
            <div>
              <label className="dash-label">{t.reviews.customerName}</label>
              <input className="dash-input" required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
            </div>
            <div>
              <label className="dash-label">{t.reviews.completionDate}</label>
              <input type="date" className="dash-input" required value={form.completionDate} onChange={(e) => setForm({ ...form, completionDate: e.target.value })} />
            </div>
            <div>
              <label className="dash-label">{t.reviews.scheduledDate}</label>
              <input type="date" className="dash-input" value={form.scheduledSendDate} onChange={(e) => setForm({ ...form, scheduledSendDate: e.target.value })} />
            </div>
            <div>
              <label className="dash-label">{t.reviews.reviewUrl}</label>
              <input className="dash-input" value={form.reviewUrl} onChange={(e) => setForm({ ...form, reviewUrl: e.target.value })} placeholder="https://" />
            </div>
            <div>
              <label className="dash-label">{t.reviews.lineUserId}</label>
              <input className="dash-input" value={form.lineUserId} onChange={(e) => setForm({ ...form, lineUserId: e.target.value })} placeholder="Uxxxxxxxx" />
              <p className="small text-muted mt-1 mb-0">{t.reviews.lineUserIdHint}</p>
            </div>
            <div>
              <label className="dash-label">Email</label>
              <input type="email" className="dash-input" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <button type="submit" className="dash-btn dash-btn--primary" disabled={loading}>
                {loading ? t.reviews.registering : t.reviews.register}
              </button>
            </div>
          </form>
        </PageCard>
      )}

      <PageCard
        title={t.reviews.title}
        badge={<span className="ms-2 small fw-normal text-muted">({reviews.length}{t.common.items})</span>}
      >
        {reviews.length === 0 ? (
          <PageEmpty message={t.reviews.noReviews} />
        ) : (
          <div className="d-flex flex-column gap-3">
            {reviews.map((review) => (
              <div key={review.id} className="dash-review-item">
                <div className="d-flex flex-column flex-sm-row align-items-sm-start justify-content-sm-between gap-3 mb-3 min-w-0">
                  <div className="min-w-0 flex-grow-1">
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <h3 className="h6 fw-bold mb-0">{review.customerName}</h3>
                      <span className={`dash-tag ${statusTag[review.sendStatus]}`}>
                        {t.reviews.status[review.sendStatus]}
                      </span>
                    </div>
                    <p className="small text-muted mt-1 mb-0">
                      {t.reviews.completionDate}: {formatDate(review.completionDate)}
                      {review.scheduledSendDate && (
                        <> ・ {t.reviews.scheduledDate}: {formatDate(review.scheduledSendDate)}</>
                      )}
                    </p>
                    {review.lineUserId && (
                      <p className="small text-muted mb-0 mt-1">LINE: {review.lineUserId}</p>
                    )}
                    {review.reviewUrl && (
                      <p className="small mb-0 mt-1 dash-break-url">
                        <a href={review.reviewUrl} target="_blank" rel="noopener noreferrer" className="dash-link">{review.reviewUrl}</a>
                      </p>
                    )}
                    {review.sendError && (
                      <p className="small text-danger mb-0 mt-1">{t.reviews.sendError}: {review.sendError}</p>
                    )}
                    <div className="d-flex flex-wrap gap-1 mt-2">
                      {review.thankSentAt && <span className="dash-tag dash-tag--success">{t.reviews.thankSent}</span>}
                      {review.reviewSentAt && <span className="dash-tag dash-tag--success">{t.reviews.reviewSent}</span>}
                      {review.followUpSentAt && <span className="dash-tag dash-tag--success">{t.reviews.followUpSent}</span>}
                    </div>
                  </div>
                  <div className="dash-review-actions d-flex flex-wrap gap-2">
                    {(review.lineUserId || review.customerEmail) && review.sendStatus !== "SENT" && (
                      <button
                        type="button"
                        className="dash-btn dash-btn--outline dash-btn--sm"
                        onClick={async () => {
                          try {
                            await api.updateReview(review.id, { sendStatus: "SCHEDULED" });
                            loadReviews();
                          } catch {
                            alert(t.reviews.updateFailed);
                          }
                        }}
                      >
                        {t.reviews.scheduleAuto}
                      </button>
                    )}
                    <button type="button" className="dash-btn dash-btn--outline dash-btn--sm" onClick={() => api.regenerateReview(review.id).then(loadReviews)}>
                      <RefreshCw size={14} />
                      {t.reviews.regenerate}
                    </button>
                    {editingId === review.id ? (
                      <button type="button" className="dash-btn dash-btn--primary dash-btn--sm" onClick={() => saveEdit(review.id)} disabled={savingId === review.id}>
                        <Save size={14} />
                        {savingId === review.id ? t.reviews.saving : t.reviews.saveMessages}
                      </button>
                    ) : (
                      <button type="button" className="dash-btn dash-btn--outline dash-btn--sm" onClick={() => startEdit(review)}>
                        {t.reviews.editMessages}
                      </button>
                    )}
                    {review.sendStatus !== "SENT" && (
                      <button type="button" className="dash-btn dash-btn--success dash-btn--sm" onClick={() => markSent(review.id)}>
                        <CheckCircle size={14} />
                        {t.reviews.markSent}
                      </button>
                    )}
                    {review.sendStatus !== "CANCELLED" && review.sendStatus !== "SENT" && (
                      <button type="button" className="dash-btn dash-btn--outline dash-btn--sm" onClick={() => markCancelled(review)}>
                        <XCircle size={14} />
                        {t.reviews.markCancelled}
                      </button>
                    )}
                    {canDeleteReview(review) && (
                      <button type="button" className="dash-btn dash-btn--danger dash-btn--sm" onClick={() => deleteReview(review)}>
                        <Trash2 size={14} />
                        {t.reviews.delete}
                      </button>
                    )}
                  </div>
                </div>

                {editingId === review.id ? (
                  <div className="dash-form-grid">
                    <div>
                      <label className="dash-label">{t.reviews.thankMessage}</label>
                      <textarea className="dash-textarea" rows={3} value={editDraft.thankMessage} onChange={(e) => setEditDraft({ ...editDraft, thankMessage: e.target.value })} />
                    </div>
                    <div>
                      <label className="dash-label">{t.reviews.reviewMessage}</label>
                      <textarea className="dash-textarea" rows={3} value={editDraft.reviewMessage} onChange={(e) => setEditDraft({ ...editDraft, reviewMessage: e.target.value })} />
                    </div>
                    <div>
                      <label className="dash-label">{t.reviews.followUp}</label>
                      <textarea className="dash-textarea" rows={3} value={editDraft.followUpMessage} onChange={(e) => setEditDraft({ ...editDraft, followUpMessage: e.target.value })} />
                    </div>
                  </div>
                ) : (
                  <div className="dash-form-grid">
                    {[
                      { key: "thankMessage" as const, label: t.reviews.thankMessage, copyLabel: t.reviews.copyThank },
                      { key: "reviewMessage" as const, label: t.reviews.reviewMessage, copyLabel: t.reviews.copyReview },
                      { key: "followUpMessage" as const, label: t.reviews.followUp, copyLabel: t.reviews.copyFollowUp },
                    ].map(({ key, label, copyLabel }) => {
                      const type = key === "thankMessage" ? "thank" : key === "reviewMessage" ? "review" : "followUp";
                      const sentAt = key === "thankMessage" ? review.thankSentAt : key === "reviewMessage" ? review.reviewSentAt : review.followUpSentAt;
                      const scheduled = key === "thankMessage" ? review.thankScheduledDate : key === "reviewMessage" ? review.reviewScheduledDate : review.followUpScheduledDate;
                      return review[key] ? (
                        <div key={key} className="dash-card--2d p-3 min-w-0">
                          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-stretch align-items-sm-start gap-2 mb-2">
                            <div className="min-w-0">
                              <p className="small fw-bold mb-0">{label}</p>
                              {scheduled && !sentAt && (
                                <p className="small text-muted mb-0">{formatDate(scheduled)}</p>
                              )}
                            </div>
                            <div className="dash-message-actions d-flex flex-wrap gap-1">
                              {review.lineUserId && !sentAt && (
                                <button
                                  type="button"
                                  className="dash-btn dash-btn--outline dash-btn--sm"
                                  onClick={async () => {
                                    try {
                                      await api.sendReviewLine(review.id, type);
                                      alert(t.reviews.sendLineDone);
                                      loadReviews();
                                    } catch {
                                      alert(t.reviews.sendLineFailed);
                                    }
                                  }}
                                >
                                  {t.reviews.sendLineNow}
                                </button>
                              )}
                              {review.customerEmail && !sentAt && (
                                <button
                                  type="button"
                                  className="dash-btn dash-btn--outline dash-btn--sm"
                                  onClick={async () => {
                                    try {
                                      await api.sendReviewEmail(review.id, type);
                                      alert(t.reviews.sendEmailDone);
                                      loadReviews();
                                    } catch {
                                      alert(t.reviews.sendEmailFailed);
                                    }
                                  }}
                                >
                                  {t.reviews.sendEmailNow}
                                </button>
                              )}
                              <button
                                type="button"
                                className="dash-btn dash-btn--outline dash-btn--sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(review[key] || "");
                                  alert(t.reviews.copyDone);
                                }}
                              >
                                <Copy size={12} />
                                {copyLabel}
                              </button>
                            </div>
                          </div>
                          <p className="small text-muted mb-0" style={{ whiteSpace: "pre-wrap" }}>{review[key]}</p>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </PageCard>
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<PageLoading />}>
        <ReviewsContent />
      </Suspense>
    </DashboardLayout>
  );
}
