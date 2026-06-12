"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader, PageCard, PageFilterBar, PageLoading, PageEmpty } from "@/components/layout/page-shell";
import { FlowStepBanner } from "@/components/dashboard/flow-step-banner";
import { FlowPageAssets } from "@/components/dashboard/flow-page-assets";
import { PAGE_FLOW_STEPS } from "@/lib/flow-images";
import { PostListTable } from "@/components/posts/post-list-table";
import { Pagination } from "@/components/ui/pagination";
import { api, PostCandidate, PostStatus } from "@/lib/api";
import { useApp } from "@/providers/app-provider";

function PostsContent() {
  const { t, isAuthenticated, authLoading } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [posts, setPosts] = useState<PostCandidate[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showManual, setShowManual] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);
  const [manualForm, setManualForm] = useState({ region: "", serviceType: "", memo: "", imageUrl: "" });

  const status = searchParams.get("status") || "";
  const source = searchParams.get("source") || "";

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    setLoading(true);
    api
      .getPosts({
        ...(status && { status }),
        ...(source && { source }),
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
  }, [status, source, search, page, authLoading, isAuthenticated]);

  const statusOptions: { value: PostStatus | ""; label: string }[] = [
    { value: "", label: t.common.all },
    ...(["NOT_CREATED", "PENDING_REVIEW", "AI_GENERATED", "APPROVED", "REJECTED", "ERROR", "CANCELLED"] as PostStatus[]).map((s) => ({
      value: s,
      label: t.status[s],
    })),
  ];

  const sourceOptions = [
    { value: "", label: t.common.all },
    ...(["GOOGLE_DRIVE", "LINE", "MANUAL"] as const).map((s) => ({
      value: s,
      label: t.source[s],
    })),
  ];

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    setPage(1);
    router.push(`/posts?${params.toString()}`);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualLoading(true);
    try {
      const post = await api.createManualPost({
        region: manualForm.region || undefined,
        serviceType: manualForm.serviceType || undefined,
        memo: manualForm.memo || undefined,
        imageUrl: manualForm.imageUrl || undefined,
      });
      setShowManual(false);
      setManualForm({ region: "", serviceType: "", memo: "", imageUrl: "" });
      router.push(`/posts/${post?.id || ""}`);
    } catch {
      alert(t.posts.manualFailed);
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <div className="dash-page">
      <PageHeader
        title={t.posts.title}
        subtitle={t.posts.subtitle}
        actions={
          <button type="button" className="dash-btn dash-btn--primary" onClick={() => setShowManual(!showManual)}>
            <Plus size={16} />
            {t.posts.manualAdd}
          </button>
        }
      />

      <FlowStepBanner steps={PAGE_FLOW_STEPS.posts} variant="mvp" />
      <FlowPageAssets page="posts" />

      {showManual && (
        <PageCard title={t.posts.manualAdd} variant="flat">
          <form onSubmit={handleManualSubmit} className="dash-form-grid dash-form-grid--2">
            <div>
              <label className="dash-label">{t.posts.manualRegion}</label>
              <input className="dash-input" value={manualForm.region} onChange={(e) => setManualForm({ ...manualForm, region: e.target.value })} />
            </div>
            <div>
              <label className="dash-label">{t.posts.manualService}</label>
              <input className="dash-input" value={manualForm.serviceType} onChange={(e) => setManualForm({ ...manualForm, serviceType: e.target.value })} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="dash-label">{t.posts.manualMemo}</label>
              <textarea className="dash-textarea" rows={3} value={manualForm.memo} onChange={(e) => setManualForm({ ...manualForm, memo: e.target.value })} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="dash-label">{t.posts.manualImageUrl}</label>
              <input className="dash-input" value={manualForm.imageUrl} onChange={(e) => setManualForm({ ...manualForm, imageUrl: e.target.value })} placeholder="https://" />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <button type="submit" className="dash-btn dash-btn--primary" disabled={manualLoading}>
                {manualLoading ? t.posts.manualSubmitting : t.posts.manualSubmit}
              </button>
            </div>
          </form>
        </PageCard>
      )}

      <PageFilterBar>
        <div className="dash-input-wrap" style={{ minWidth: "12rem", flex: "1 1 14rem" }}>
          <Search size={16} className="dash-input-icon" />
          <input
            type="search"
            className="dash-input"
            placeholder={t.posts.searchPlaceholder}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select className="dash-select" style={{ flex: "0 1 auto", minWidth: "10rem" }} value={status} onChange={(e) => updateFilter("status", e.target.value)}>
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{t.posts.statusFilter}: {opt.label}</option>
          ))}
        </select>
        <select className="dash-select" style={{ flex: "0 1 auto", minWidth: "10rem" }} value={source} onChange={(e) => updateFilter("source", e.target.value)}>
          {sourceOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{t.posts.sourceFilter}: {opt.label}</option>
          ))}
        </select>
      </PageFilterBar>

      <PageCard
        title={t.posts.title}
        badge={<span className="ms-2 small fw-normal text-muted">({total}{t.common.items})</span>}
      >
        {loading ? (
          <PageLoading />
        ) : posts.length === 0 ? (
          <PageEmpty message={t.posts.noPosts} />
        ) : (
          <>
            <PostListTable posts={posts} />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </PageCard>
    </div>
  );
}

export default function PostsPage() {
  const { t } = useApp();
  return (
    <DashboardLayout>
      <Suspense fallback={<PageLoading />}>
        <PostsContent />
      </Suspense>
    </DashboardLayout>
  );
}
