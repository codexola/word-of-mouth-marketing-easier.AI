"use client";

import { Check, RefreshCw, X } from "lucide-react";
import { PostPhoto } from "@/components/posts/post-thumbnail";
import { PostCandidate } from "@/lib/api";
import { getPrimaryPostImageUrl } from "@/lib/post-images";
import { useApp } from "@/providers/app-provider";

interface PostReviewModalProps {
  post: PostCandidate;
  loading: string | null;
  onApprove: () => void;
  onReject: () => void;
  onRegenerate: () => void;
  onCancel: () => void;
}

export function PostReviewModal({
  post,
  loading,
  onApprove,
  onReject,
  onRegenerate,
  onCancel,
}: PostReviewModalProps) {
  const { t } = useApp();
  const title = post.generation?.title || "";
  const body = post.generation?.body || "";
  const thumbUrl = getPrimaryPostImageUrl(post);

  return (
    <div className="dash-modal-backdrop">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        className="dash-modal dash-modal--lg"
      >
        <div className="dash-modal__header">
          <div>
            <h2 id="review-modal-title" className="dash-modal__title">{t.reviewModal.title}</h2>
            <p className="small text-muted mb-0 mt-1">{t.reviewModal.subtitle}</p>
          </div>
        </div>

        <div className="dash-modal__body">
          <PostPhoto
            src={thumbUrl}
            alt=""
            className="mb-3 border"
            aspectRatio="16 / 9"
          />

          <div className="dash-form-grid dash-form-grid--2 mb-3 small">
            <div><span className="text-muted">{t.posts.region}: </span>{post.region || "-"}</div>
            <div><span className="text-muted">{t.posts.service}: </span>{post.serviceType || "-"}</div>
          </div>

          <div className="mb-3">
            <p className="dash-label">{t.postDetail.postTitle}</p>
            <div className="dash-card--2d p-2 small">{title}</div>
          </div>

          <div className="mb-3">
            <p className="dash-label">{t.postDetail.postBody}</p>
            <div className="dash-card--2d p-2 small" style={{ maxHeight: "12rem", overflowY: "auto", whiteSpace: "pre-wrap" }}>{body}</div>
          </div>

          {post.generation?.cautions && (
            <div className="dash-alert dash-alert--warning">{t.postDetail.caution}: {post.generation.cautions}</div>
          )}
        </div>

        <div className="dash-modal__footer flex-column flex-sm-row">
          <button type="button" className="dash-btn dash-btn--success w-100 w-sm-auto" onClick={onApprove} disabled={!!loading || !title || !body}>
            <Check size={16} />
            {loading === "approve" ? t.postDetail.approving : t.reviewModal.approve}
          </button>
          <button type="button" className="dash-btn dash-btn--outline w-100 w-sm-auto" onClick={onRegenerate} disabled={!!loading}>
            <RefreshCw size={16} className={loading === "regenerate" ? "spin" : ""} />
            {loading === "regenerate" ? t.reviewModal.regenerating : t.reviewModal.regenerate}
          </button>
          <button type="button" className="dash-btn dash-btn--outline w-100 w-sm-auto" onClick={onReject} disabled={!!loading}>
            <X size={16} />
            {loading === "reject" ? t.reviewModal.rejecting : t.reviewModal.reject}
          </button>
          <button type="button" className="dash-btn dash-btn--danger w-100 w-sm-auto" onClick={onCancel} disabled={!!loading}>
            <X size={16} />
            {loading === "cancel" ? t.reviewModal.cancelling : t.reviewModal.cancelAd}
          </button>
        </div>
      </div>
    </div>
  );
}
