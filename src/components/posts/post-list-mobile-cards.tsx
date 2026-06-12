"use client";

import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { StatusBadge } from "@/components/posts/status-badge";
import { PostCandidate } from "@/lib/api";
import { getPrimaryPostImageUrl } from "@/lib/post-images";
import { formatDate, truncate } from "@/lib/utils";
import { useApp } from "@/providers/app-provider";

interface PostListMobileCardsProps {
  posts: PostCandidate[];
  showBody?: boolean;
}

export function PostListMobileCards({ posts, showBody = true }: PostListMobileCardsProps) {
  const { t } = useApp();

  return (
    <div className="dash-mobile-list">
      {posts.map((post) => {
        const thumbUrl = getPrimaryPostImageUrl(post);
        return (
          <article key={post.id} className="dash-mobile-card">
            <div className="dash-mobile-card__header">
              <Link href={`/posts/${post.id}`} className="shrink-0">
                {thumbUrl ? (
                  <div className="dash-thumb position-relative">
                    <Image src={thumbUrl} alt="" fill className="object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="dash-thumb d-flex align-items-center justify-content-center">
                    <ImageIcon size={18} className="text-muted" />
                  </div>
                )}
              </Link>
              <div className="dash-mobile-card__main min-w-0 flex-grow-1">
                <Link href={`/posts/${post.id}`} className="dash-link dash-mobile-card__title">
                  {post.generation?.title || t.posts.notGenerated}
                </Link>
                <div className="d-flex flex-wrap align-items-center gap-2 mt-1">
                  <StatusBadge status={post.status} />
                  <span className="small text-muted">{formatDate(post.createdAt)}</span>
                </div>
              </div>
            </div>
            <dl className="dash-mobile-card__meta">
              <div>
                <dt>{t.posts.region}</dt>
                <dd>{post.region || "-"}</dd>
              </div>
              <div>
                <dt>{t.posts.service}</dt>
                <dd>{post.serviceType || "-"}</dd>
              </div>
              <div>
                <dt>{t.posts.source}</dt>
                <dd>{t.source[post.source]}</dd>
              </div>
              {showBody && (
                <div className="dash-mobile-card__full">
                  <dt>{t.posts.body}</dt>
                  <dd>{post.generation?.body ? truncate(post.generation.body, 120) : "-"}</dd>
                </div>
              )}
            </dl>
          </article>
        );
      })}
    </div>
  );
}
