"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Copy, CheckCircle, Send } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader, PageCard, PageFilterBar, PageLoading, PageEmpty } from "@/components/layout/page-shell";
import Image from "next/image";
import { FlowStepBanner } from "@/components/dashboard/flow-step-banner";
import { FlowPageAssets } from "@/components/dashboard/flow-page-assets";
import { FLOW_IMAGES, PAGE_FLOW_STEPS } from "@/lib/flow-images";
import { StatusBadge } from "@/components/posts/status-badge";
import { Pagination } from "@/components/ui/pagination";
import { api, ApprovedPost, PostStatus, ApiError } from "@/lib/api";
import { formatDate, truncate } from "@/lib/utils";
import { useApp } from "@/providers/app-provider";

function HistoryContent() {
  const { t, isAuthenticated, authLoading } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [posts, setPosts] = useState<ApprovedPost[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const status = searchParams.get("status") || "";

  const loadPosts = () => {
    if (!isAuthenticated) return;
    setLoading(true);
    api
      .getApprovedPosts({
        ...(status && { status }),
        ...(search && { search }),
        page: String(page),
        limit: "20",
      })
      .then((res) => {
        setPosts(res.items);
        setTotalPages(res.totalPages);
        setTotal(res.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    loadPosts();
  }, [status, search, page, authLoading, isAuthenticated]);

  const statusOptions: { value: PostStatus | ""; label: string }[] = [
    { value: "", label: t.common.all },
    { value: "READY_TO_POST", label: t.status.READY_TO_POST },
    { value: "POSTED", label: t.status.POSTED },
    { value: "APPROVED", label: t.status.APPROVED },
  ];

  return (
    <div className="dash-page">
      <PageHeader title={t.history.title} subtitle={t.history.subtitle} />

      <FlowStepBanner steps={PAGE_FLOW_STEPS.history} variant="mvp" />
      <FlowPageAssets page="history" />

      <PageFilterBar>
        <div className="dash-input-wrap" style={{ minWidth: "12rem", flex: "1 1 14rem" }}>
          <Search size={16} className="dash-input-icon" />
          <input
            type="search"
            className="dash-input"
            placeholder={t.history.searchPlaceholder}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="dash-select"
          style={{ flex: "0 1 auto", minWidth: "10rem" }}
          value={status}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams.toString());
            if (e.target.value) params.set("status", e.target.value);
            else params.delete("status");
            setPage(1);
            router.push(`/history?${params.toString()}`);
          }}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </PageFilterBar>

      <div className="row g-3 mb-1">
        <div className="col-12 col-md-5">
          <div className="dash-card--2d p-3 h-100 text-center" style={{ background: "var(--flow-mvp-bg)" }}>
            <Image src={FLOW_IMAGES.database} alt="" width={80} height={80} unoptimized className="mb-2" />
            <p className="small fw-semibold mb-0">{t.flow.mvpSteps[5].title}</p>
          </div>
        </div>
        <div className="col-12 col-md-7">
          <div className="dash-card--2d p-3 h-100" style={{ background: "var(--flow-exp-bg)" }}>
            <div className="d-flex align-items-center gap-3">
              <Image src={FLOW_IMAGES.analytics} alt="" width={100} height={80} unoptimized style={{ objectFit: "contain" }} />
              <div>
                <p className="small fw-bold mb-1">{t.flow.expansionSteps[4].title}</p>
                <p className="small text-muted mb-0">{t.flow.expansionSteps[4].desc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PageCard
        title={t.history.title}
        badge={<span className="ms-2 small fw-normal text-muted">({total}{t.common.items})</span>}
      >
        {loading ? (
          <PageLoading />
        ) : posts.length === 0 ? (
          <PageEmpty message={t.history.noPosts} />
        ) : (
          <>
            <div className="dash-table-wrap">
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
                        {post.imageUrls?.[0] ? (
                          <Image src={post.imageUrls[0]} alt="" width={48} height={48} unoptimized className="rounded border" style={{ objectFit: "cover" }} />
                        ) : (
                          <span className="text-muted small">-</span>
                        )}
                      </td>
                      <td className="fw-semibold">{post.title}</td>
                      <td className="text-muted" style={{ maxWidth: "12rem" }}>{truncate(post.body, 50)}</td>
                      <td><StatusBadge status={post.status} /></td>
                      <td className="text-muted small">{post.approvedBy?.name || "-"}</td>
                      <td className="text-muted">{formatDate(post.approvedAt)}</td>
                      <td className="text-muted">{post.postedAt ? formatDate(post.postedAt) : "-"}</td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          <button
                            type="button"
                            className="dash-btn dash-btn--outline dash-btn--sm"
                            onClick={() => {
                              navigator.clipboard.writeText(`${post.title}\n\n${post.body}`);
                              alert(t.history.copyDone);
                            }}
                          >
                            <Copy size={14} />
                            {t.history.copyForPost}
                          </button>
                          {post.status !== "POSTED" && (
                            <>
                              <button
                                type="button"
                                className="dash-btn dash-btn--primary dash-btn--sm"
                                onClick={async () => {
                                  try {
                                    await api.publishToGbp(post.id);
                                    alert(t.history.publishGbpDone);
                                    loadPosts();
                                  } catch (err) {
                                    alert(err instanceof ApiError ? err.message : t.history.publishGbpFailed);
                                  }
                                }}
                              >
                                <Send size={14} />
                                {t.history.publishGbp}
                              </button>
                              <button
                                type="button"
                                className="dash-btn dash-btn--success dash-btn--sm"
                                onClick={async () => {
                                  await api.markAsPosted(post.id);
                                  loadPosts();
                                }}
                              >
                                <CheckCircle size={14} />
                                {t.history.markPosted}
                              </button>
                            </>
                          )}
                          {post.gbpPostId && (
                            <span className="dash-tag dash-tag--success">{t.history.gbpPosted}</span>
                          )}
                          {post.errorMessage && (
                            <span className="dash-tag dash-tag--danger small" title={post.errorMessage}>GBP ERR</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </PageCard>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<PageLoading />}>
        <HistoryContent />
      </Suspense>
    </DashboardLayout>
  );
}
