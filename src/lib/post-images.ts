import type { ApprovedPost, PostCandidate } from "./api";
import { resolveMediaUrl, resolveMediaUrls } from "./media-url";

type PostWithImages = Pick<PostCandidate, "images"> & {
  approvedPost?: Pick<ApprovedPost, "imageUrls"> | null;
};

/** 投稿候補・履歴・アーカイブで共通の代表画像URL */
export function getPrimaryPostImageUrl(post: PostWithImages): string | undefined {
  const fromArchive = post.approvedPost?.imageUrls?.find(Boolean);
  const raw = fromArchive || post.images.find((img) => img.url)?.url;
  return resolveMediaUrl(raw);
}

/** 承認済み投稿の代表画像URL */
export function getApprovedPostImageUrl(post: ApprovedPost): string | undefined {
  const raw =
    post.imageUrls?.find(Boolean) || post.postCandidate?.images?.find((img) => img.url)?.url;
  return resolveMediaUrl(raw);
}

/** 投稿に紐づく全画像URL（アーカイブ優先） */
export function getPostImageUrls(post: PostWithImages): string[] {
  const archiveUrls = (post.approvedPost?.imageUrls || []).filter(Boolean);
  if (archiveUrls.length > 0) return resolveMediaUrls(archiveUrls);
  return resolveMediaUrls(post.images.map((img) => img.url));
}
