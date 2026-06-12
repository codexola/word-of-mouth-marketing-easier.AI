"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { api, MediaPhoto, SOURCE_LABELS } from "@/lib/api";
import { useApp } from "@/providers/app-provider";
import { PageCard } from "@/components/layout/page-shell";

type SourceFilter = "ALL" | "GOOGLE_DRIVE" | "LINE";

export function MediaGallery() {
  const { t } = useApp();
  const [items, setItems] = useState<MediaPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [source, setSource] = useState<SourceFilter>("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: "24",
      };
      if (source !== "ALL") params.source = source;
      const res = await api.getMediaPhotos(params);
      setItems(res.items);
      setTotalPages(res.totalPages);
    } catch {
      setItems([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, source]);

  useEffect(() => {
    loadPhotos().catch(() => {});
  }, [loadPhotos]);

  const handleDelete = async (photo: MediaPhoto) => {
    const msg = t.dashboard.media.deleteConfirm.replace("{name}", photo.fileName || photo.id.slice(0, 8));
    if (!window.confirm(msg)) return;

    setDeletingId(photo.id);
    try {
      const res = await api.deleteMediaPhoto(photo.id);
      if (res.warnings?.length) {
        alert([t.dashboard.media.deleted, ...res.warnings].join("\n"));
      }
      await loadPhotos();
    } catch {
      alert(t.dashboard.media.deleteFailed);
    } finally {
      setDeletingId(null);
    }
  };

  const filters: { key: SourceFilter; label: string }[] = [
    { key: "ALL", label: t.dashboard.media.filterAll },
    { key: "GOOGLE_DRIVE", label: t.dashboard.media.filterDrive },
    { key: "LINE", label: t.dashboard.media.filterLine },
  ];

  return (
    <PageCard title={t.dashboard.media.title} subtitle={t.dashboard.media.subtitle}>
      <div className="d-flex flex-wrap gap-2 mb-3">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`dash-btn dash-btn--sm ${source === f.key ? "dash-btn--primary" : "dash-btn--outline"}`}
            onClick={() => {
              setSource(f.key);
              setPage(1);
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="dash-empty mb-0">{t.dashboard.media.loading}</p>
      ) : items.length === 0 ? (
        <p className="dash-empty mb-0">{t.dashboard.media.empty}</p>
      ) : (
        <div className="row g-3">
          {items.map((photo) => (
            <div key={photo.id} className="col-6 col-md-4 col-lg-3 col-xl-2">
              <div className="media-gallery-card h-100 border rounded overflow-hidden position-relative">
                <div className="media-gallery-thumb ratio ratio-1x1 bg-light">
                  <Image
                    src={photo.url}
                    alt={photo.fileName || ""}
                    fill
                    unoptimized
                    className="object-fit-cover"
                    sizes="(max-width: 768px) 50vw, 200px"
                  />
                </div>
                <div className="p-2 small">
                  <p className="mb-1 fw-semibold text-truncate" title={photo.fileName || undefined}>
                    {photo.fileName || "—"}
                  </p>
                  <p className="mb-1 text-muted">
                    {SOURCE_LABELS[photo.postSource as keyof typeof SOURCE_LABELS] || photo.postSource}
                  </p>
                  {photo.inArchive && (
                    <span className="badge text-bg-secondary mb-1">{t.dashboard.media.inArchive}</span>
                  )}
                  <button
                    type="button"
                    className="dash-btn dash-btn--danger dash-btn--sm w-100 mt-1"
                    disabled={deletingId === photo.id}
                    onClick={() => handleDelete(photo)}
                  >
                    <Trash2 size={14} />
                    <span>{deletingId === photo.id ? t.dashboard.media.deleting : t.dashboard.media.delete}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
          <button
            type="button"
            className="dash-btn dash-btn--outline dash-btn--sm"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {t.dashboard.media.prev}
          </button>
          <span className="small text-muted">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            className="dash-btn dash-btn--outline dash-btn--sm"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            {t.dashboard.media.next}
          </button>
        </div>
      )}
    </PageCard>
  );
}
