import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { StatusBadge } from "@/components/posts/status-badge";
import { PostCandidate } from "@/lib/api";
import { formatDate, truncate } from "@/lib/utils";
import { useApp } from "@/providers/app-provider";

interface PostListTableProps {
  posts: PostCandidate[];
  showBody?: boolean;
}

export function PostListTable({ posts, showBody = true }: PostListTableProps) {
  const { t } = useApp();

  return (
    <div className="dash-table-wrap">
      <table className="dash-table">
        <thead>
          <tr>
            <th>{t.posts.photo}</th>
            <th>{t.posts.region}</th>
            <th>{t.posts.service}</th>
            <th>{t.posts.postTitle}</th>
            {showBody && <th>{t.posts.body}</th>}
            <th>{t.posts.source}</th>
            <th>{t.posts.status}</th>
            <th>{t.posts.createdAt}</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>
                <Link href={`/posts/${post.id}`}>
                  {post.images[0]?.url ? (
                    <div className="dash-thumb position-relative">
                      <Image src={post.images[0].url} alt="" fill className="object-cover" unoptimized />
                    </div>
                  ) : (
                    <div className="dash-thumb d-flex align-items-center justify-content-center">
                      <ImageIcon size={18} className="text-muted" />
                    </div>
                  )}
                </Link>
              </td>
              <td>{post.region || "-"}</td>
              <td>{post.serviceType || "-"}</td>
              <td>
                <Link href={`/posts/${post.id}`} className="dash-link">
                  {post.generation?.title || t.posts.notGenerated}
                </Link>
              </td>
              {showBody && (
                <td className="text-muted" style={{ maxWidth: "14rem" }}>
                  {post.generation?.body ? truncate(post.generation.body, 60) : "-"}
                </td>
              )}
              <td>{t.source[post.source]}</td>
              <td><StatusBadge status={post.status} /></td>
              <td className="text-muted">{formatDate(post.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
