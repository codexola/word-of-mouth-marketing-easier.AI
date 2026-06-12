import type { ApprovedPost, PostCandidate } from "./api";

type PostWithImages = Pick<PostCandidate, "images"> & {
  approvedPost?: Pick<ApprovedPost, "imageUrls"> | null;
};

/** 投稿候補・履歴・アーカイブで共通の代表画像URL */
export function getPrimaryPostImageUrl(post: PostWithImages): string | undefined {
  const fromArchive = post.approvedPost?.imageUrls?.find(Boolean);
  if (fromArchive) return fromArchive;
  return post.images.find((img) => img.url)?.url;
}

/** 投稿に紐づく全画像URL（アーカイブ優先） */
export function getPostImageUrls(post: PostWithImages): string[] {
  const archiveUrls = (post.approvedPost?.imageUrls || []).filter(Boolean);
  if (archiveUrls.length > 0) return archiveUrls;
  return post.images.map((img) => img.url).filter(Boolean);
}
