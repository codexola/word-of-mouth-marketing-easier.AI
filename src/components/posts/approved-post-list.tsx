"use client";

import { Copy, CheckCircle, Send, Pencil, Trash2, Save, X } from "lucide-react";
import { PostThumbnail } from "@/components/posts/post-thumbnail";
import { StatusBadge } from "@/components/posts/status-badge";
import { ApprovedPost } from "@/lib/api";
import { getApprovedPostImageUrl } from "@/lib/post-images";
import { formatDate, truncate } from "@/lib/utils";
import { useApp } from "@/providers/app-provider";

interface ApprovedPostListProps {
  posts: ApprovedPost[];
  editingId: string | null;
  editTitle: string;
  editBody: string;
  actionLoading: string;
  onEditTitleChange: (value: string) => void;
  onEditBodyChange: (value: string) => void;
  onStartEdit: (post: ApprovedPost) => void;
  onCancelEdit: () => void;
  onSaveEdit: (postId: string) => void;
  onCopy: (post: ApprovedPost) => void;
  onPublishGbp: (postId: string) => void;
  onMarkPosted: (postId: string) => void;
  onDelete: (postId: string) => void;
}

function PostActions({
  post,
  editingId,
  actionLoading,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onCopy,
  onPublishGbp,
  onMarkPosted,
  onDelete,
  layout,
}: ApprovedPostListProps & { post: ApprovedPost; layout: "card" | "table" }) {
  const { t } = useApp();
  const isEditing = editingId === post.id;

  return (
    <div className={layout === "card" ? "dash-mobile-card__actions" : "d-flex flex-wrap gap-1"}>
      <button type="button" className="dash-btn dash-btn--outline dash-btn--sm" onClick={() => onCopy(post)}>
        <Copy size={14} />
        {t.history.copyForPost}
      </button>
      {post.status !== "POSTED" && (
        <>
          <button type="button" className="dash-btn dash-btn--primary dash-btn--sm" onClick={() => onPublishGbp(post.id)}>
            <Send size={14} />
            {t.history.publishGbp}
          </button>
          <button type="button" className="dash-btn dash-btn--success dash-btn--sm" onClick={() => onMarkPosted(post.id)}>
            <CheckCircle size={14} />
            {t.history.markPosted}
          </button>
        </>
      )}
      {post.gbpPostId && <span className="dash-tag dash-tag--success">{t.history.gbpPosted}</span>}
      {post.errorMessage && (
        <span className="dash-tag dash-tag--danger small" title={post.errorMessage}>
          GBP ERR
        </span>
      )}
      {isEditing ? (
        <>
          <button
            type="button"
            className="dash-btn dash-btn--primary dash-btn--sm"
            disabled={!!actionLoading}
            onClick={() => onSaveEdit(post.id)}
          >
            <Save size={14} />
            {t.history.saveEdit}
          </button>
          <button type="button" className="dash-btn dash-btn--outline dash-btn--sm" onClick={onCancelEdit}>
            <X size={14} />
            {t.common.cancel}
          </button>
        </>
      ) : (
        <>
          <button type="button" className="dash-btn dash-btn--outline dash-btn--sm" onClick={() => onStartEdit(post)}>
            <Pencil size={14} />
            {t.history.editPost}
          </button>
          <button
            type="button"
            className="dash-btn dash-btn--danger dash-btn--sm"
            disabled={!!actionLoading}
            onClick={() => onDelete(post.id)}
          >
            <Trash2 size={14} />
            {t.history.deletePost}
          </button>
        </>
      )}
    </div>
  );
}

export function ApprovedPostList(props: ApprovedPostListProps) {
  const { posts, editingId, editTitle, editBody, onEditTitleChange, onEditBodyChange } = props;
  const { t } = useApp();

  return (
    <>
      <div className="d-md-none">
        <div className="dash-mobile-list">
          {posts.map((post) => (
            <article key={post.id} className="dash-mobile-card">
              <div className="dash-mobile-card__header">
                <PostThumbnail src={getApprovedPostImageUrl(post)} size="sm" className="shrink-0" />
                <div className="dash-mobile-card__main min-w-0 flex-grow-1">
                  {editingId === post.id ? (
                    <input
                      className="dash-input dash-input--sm w-100"
                      value={editTitle}
                      onChange={(e) => onEditTitleChange(e.target.value)}
                    />
                  ) : (
                    <p className="fw-semibold mb-0 dash-mobile-card__title">{post.title}</p>
                  )}
                  <div className="d-flex flex-wrap align-items-center gap-2 mt-1">
                    <StatusBadge status={post.status} />
                    {post.approvedBy?.name && (
                      <span className="small text-muted">{post.approvedBy.name}</span>
                    )}
                  </div>
                </div>
              </div>
              <dl className="dash-mobile-card__meta">
                <div className="dash-mobile-card__full">
                  <dt>{t.posts.body}</dt>
                  <dd>
                    {editingId === post.id ? (
                      <textarea
                        className="dash-textarea w-100"
                        rows={3}
                        value={editBody}
                        onChange={(e) => onEditBodyChange(e.target.value)}
                      />
                    ) : (
                      truncate(post.body, 80)
                    )}
                  </dd>
                </div>
                <div>
                  <dt>{t.history.approvedAt}</dt>
                  <dd>{formatDate(post.approvedAt)}</dd>
                </div>
                <div>
                  <dt>{t.history.postedAt}</dt>
                  <dd>{post.postedAt ? formatDate(post.postedAt) : "-"}</dd>
                </div>
              </dl>
              <PostActions {...props} post={post} layout="card" />
            </article>
          ))}
        </div>
      </div>

      <div className="dash-table-wrap d-none d-md-block">
        <table className="dash-table">
          <thead>
            <tr>
              <th>{t.posts.photo}</th>
              <th>{t.posts.postTitle}</th>
              <th>{t.posts.body}</th>
              <th>{t.posts.status}</th>
              <th>{t.history.approver}</th>
              <th>{t.history.approvedAt}</th>
              <th>{t.history.postedAt}</th>
              <th>{t.common.copy}</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <PostThumbnail src={getApprovedPostImageUrl(post)} size="sm" />
                </td>
                <td className="fw-semibold">
                  {editingId === post.id ? (
                    <input
                      className="dash-input dash-input--sm"
                      value={editTitle}
                      onChange={(e) => onEditTitleChange(e.target.value)}
                    />
                  ) : (
                    post.title
                  )}
                </td>
                <td className="text-muted" style={{ maxWidth: "12rem" }}>
                  {editingId === post.id ? (
                    <textarea
                      className="dash-textarea"
                      rows={3}
                      value={editBody}
                      onChange={(e) => onEditBodyChange(e.target.value)}
                    />
                  ) : (
                    truncate(post.body, 50)
                  )}
                </td>
                <td>
                  <StatusBadge status={post.status} />
                </td>
                <td className="text-muted small">{post.approvedBy?.name || "-"}</td>
                <td className="text-muted">{formatDate(post.approvedAt)}</td>
                <td className="text-muted">{post.postedAt ? formatDate(post.postedAt) : "-"}</td>
                <td>
                  <PostActions {...props} post={post} layout="table" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
