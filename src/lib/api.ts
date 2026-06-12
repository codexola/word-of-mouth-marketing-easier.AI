import { getApiBaseUrl, getFrontendOrigin } from "./api-url";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("token");
    if (!window.location.pathname.startsWith("/login")) {
      window.location.replace("/login");
    }
    throw new ApiError(
      (data as { error?: string }).error || "Authentication required",
      401
    );
  }

  if (!res.ok) {
    throw new ApiError(
      (data as { error?: string }).error || "Request failed",
      res.status
    );
  }

  return data as T;
}

export const api = {
  login: (email: string, password: string, code?: string) =>
    request<{
      token?: string;
      requiresCode?: boolean;
      message?: string;
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        preferredLocale?: string;
        preferredTheme?: string;
        isDeveloperSession?: boolean;
      };
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, ...(code ? { code } : {}) }),
    }),

  getUsers: () =>
    request<{
      items: ManagedUser[];
    }>("/users"),

  getSubscriberLocations: () =>
    request<{ items: SubscriberLocation[] }>("/users/subscriber-locations"),

  createUser: (data: {
    email: string;
    password: string;
    name: string;
    role: "ADMIN" | "USER";
  }) =>
    request<{ user: ManagedUser }>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteUser: (id: string) =>
    request<{ success: boolean }>(`/users/${id}`, { method: "DELETE" }),

  me: () =>
    request<{
      user: {
        id: string;
        email: string;
        name: string;
        role: string;
        preferredLocale?: string;
        preferredTheme?: string;
        isDeveloperSession?: boolean;
      };
    }>("/auth/me"),

  updateAccount: (data: {
    name?: string;
    email?: string;
    currentPassword: string;
    newPassword?: string;
    preferredLocale?: string;
    preferredTheme?: string;
  }) =>
    request<{
      token: string;
      user: {
        id: string;
        email: string;
        name: string;
        role: string;
        preferredLocale?: string;
        preferredTheme?: string;
        isDeveloperSession?: boolean;
      };
    }>("/auth/account", { method: "PUT", body: JSON.stringify(data) }),

  getStats: () =>
    request<{
      pendingReview: number;
      aiGenerated: number;
      posted: number;
      errors: number;
      reviewScheduled: number;
      total: number;
      readyToPost: number;
      cancelled: number;
    }>("/posts/stats"),

  getPosts: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return request<{
      items: PostCandidate[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/posts${query}`);
  },

  getPost: (id: string) => request<PostCandidateDetail>(`/posts/${id}`),

  createManualPost: (data: {
    region?: string;
    serviceType?: string;
    workDescription?: string;
    memo?: string;
    imageUrl?: string;
  }) =>
    request<PostCandidateDetail>("/posts/manual", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  generatePost: (id: string) => request(`/posts/${id}/generate`, { method: "POST" }),

  updatePostContent: (id: string, data: { title: string; body: string }) =>
    request(`/posts/${id}/content`, { method: "PUT", body: JSON.stringify(data) }),

  approvePost: (id: string) => request(`/posts/${id}/approve`, { method: "POST" }),

  rejectPost: (id: string, reason?: string) =>
    request<PostCandidate["generation"]>(`/posts/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),

  cancelPost: (id: string) => request(`/posts/${id}/cancel`, { method: "POST" }),

  restorePost: (id: string) =>
    request<PostCandidateDetail>(`/posts/${id}/restore`, { method: "POST" }),

  repairErrorPosts: () =>
    request<{ total: number; repaired: number }>("/posts/repair-errors", { method: "POST" }),

  getApprovedPosts: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return request<{
      items: ApprovedPost[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/posts/approved${query}`);
  },

  markAsPosted: (id: string) =>
    request(`/posts/approved/${id}/mark-posted`, { method: "POST" }),

  publishToGbp: (id: string) =>
    request<ApprovedPost>(`/posts/approved/${id}/publish-gbp`, { method: "POST" }),

  updateApprovedPost: (id: string, data: { title: string; body: string }) =>
    request<PostCandidateDetail>(`/posts/approved/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteApprovedPost: (id: string) =>
    request<{ success: boolean; gbpWarning?: string }>(`/posts/approved/${id}`, {
      method: "DELETE",
    }),

  deletePost: (id: string) =>
    request<{ success: boolean; gbpWarning?: string }>(`/posts/${id}`, {
      method: "DELETE",
    }),

  getGbpStatus: () =>
    request<{
      oauthConfigured: boolean;
      connected: boolean;
      autoPostEnabled: boolean;
      readyToPublish?: boolean;
      issues?: string[];
      accountId?: string | null;
      locationId?: string | null;
      locationName?: string | null;
      tokenExpiresAt?: string | null;
    }>("/gbp/status"),

  getGbpAuthUrl: () => {
    const returnUrl = encodeURIComponent(getFrontendOrigin());
    return request<{ url: string }>(`/gbp/auth-url?returnUrl=${returnUrl}`);
  },

  getGbpLocations: () =>
    request<{
      items: {
        accountId: string;
        accountName: string;
        locationId: string;
        locationName: string;
        title: string;
        address?: string;
      }[];
    }>("/gbp/locations"),

  selectGbpLocation: (data: { accountId: string; locationId: string; locationTitle?: string }) =>
    request("/gbp/select-location", { method: "POST", body: JSON.stringify(data) }),

  disconnectGbp: () => request("/gbp/disconnect", { method: "POST" }),

  getGmailStatus: () =>
    request<{
      oauthConfigured: boolean;
      connected: boolean;
      fromEmail?: string | null;
      sendMethod?: string;
      autoSendEnabled?: boolean;
      tokenExpiresAt?: string | null;
    }>("/gmail/status"),

  getGmailAuthUrl: () => {
    const returnUrl = encodeURIComponent(getFrontendOrigin());
    return request<{ url: string }>(`/gmail/auth-url?returnUrl=${returnUrl}`);
  },

  disconnectGmail: () => request("/gmail/disconnect", { method: "POST" }),

  getSettings: () => request<AppSettings>("/settings"),

  updateSettings: (data: Partial<AppSettings>) =>
    request<AppSettings>("/settings", { method: "PUT", body: JSON.stringify(data) }),

  syncDrive: () => request<{ synced: number; skipped: number }>("/drive/sync", { method: "POST" }),

  getMediaPhotos: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return request<{
      items: MediaPhoto[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/media${query}`);
  },

  deleteMediaPhoto: (id: string) =>
    request<{ success: boolean; warnings?: string[]; postDeleted?: boolean }>(`/media/${id}`, {
      method: "DELETE",
    }),

  getLineStatus: () =>
    request<{
      enabled: boolean;
      configured: boolean;
      hasSecret: boolean;
      hasToken: boolean;
      webhookUrl: string;
      autoSendEnabled?: boolean;
    }>("/line/status"),

  getReviews: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return request<{ items: ReviewRequest[]; total: number }>(`/reviews${query}`);
  },

  createReview: (data: {
    customerName: string;
    completionDate: string;
    reviewUrl?: string;
    scheduledSendDate?: string;
    lineUserId?: string;
    customerEmail?: string;
  }) => request<ReviewRequest>("/reviews", { method: "POST", body: JSON.stringify(data) }),

  sendReviewLine: (id: string, type: "thank" | "review" | "followUp") =>
    request<ReviewRequest>(`/reviews/${id}/send-line`, {
      method: "POST",
      body: JSON.stringify({ type }),
    }),

  sendReviewEmail: (id: string, type: "thank" | "review" | "followUp") =>
    request<ReviewRequest>(`/reviews/${id}/send-email`, {
      method: "POST",
      body: JSON.stringify({ type }),
    }),

  updateReview: (id: string, data: Partial<ReviewRequest>) =>
    request<ReviewRequest>(`/reviews/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  regenerateReview: (id: string) =>
    request<ReviewRequest>(`/reviews/${id}/regenerate`, { method: "POST" }),
};

export interface MediaPhoto {
  id: string;
  url: string;
  fileName?: string | null;
  mimeType?: string | null;
  sourceFileId?: string | null;
  storagePath?: string | null;
  createdAt: string;
  postCandidateId: string;
  postStatus: PostStatus;
  postSource: "GOOGLE_DRIVE" | "LINE" | "MANUAL";
  postTitle?: string | null;
  postRegion?: string | null;
  approvedPostId?: string | null;
  approvedStatus?: PostStatus | null;
  inArchive: boolean;
}

export interface PostCandidate {
  id: string;
  source: "GOOGLE_DRIVE" | "LINE" | "MANUAL";
  status: PostStatus;
  region?: string | null;
  serviceType?: string | null;
  memo?: string | null;
  createdAt: string;
  images: { id: string; url: string; fileName?: string | null }[];
  generation?: {
    title: string;
    body: string;
    shortBody?: string | null;
    politeBody?: string | null;
    regionalBody?: string | null;
    serviceKeywords?: string[];
    reviewRequestText?: string | null;
    cautions?: string | null;
  } | null;
}

export interface PostCandidateDetail extends PostCandidate {
  workDescription?: string | null;
  errorMessage?: string | null;
  editHistories?: {
    id: string;
    action: string;
    title: string;
    body: string;
    createdAt: string;
    user?: { name: string } | null;
  }[];
  approvedPost?: ApprovedPost | null;
}

export interface ApprovedPost {
  id: string;
  title: string;
  body: string;
  region?: string | null;
  serviceType?: string | null;
  imageUrls: string[];
  status: PostStatus;
  approvedAt: string;
  postedAt?: string | null;
  gbpPostId?: string | null;
  gbpPublishedAt?: string | null;
  errorMessage?: string | null;
  postCandidate?: PostCandidate;
  approvedBy?: { name: string } | null;
}

export type PostStatus =
  | "NOT_CREATED"
  | "AI_GENERATED"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "READY_TO_POST"
  | "POSTED"
  | "REJECTED"
  | "CANCELLED"
  | "ERROR";

export interface AppSettings {
  businessProfileUrl?: string | null;
  reviewRequestUrl?: string | null;
  serviceAreas: string[];
  services: { name: string; keywords?: string[] }[];
  keywords: string[];
  ngWords: string[];
  toneDescription: string;
  samplePosts: { title: string; body: string }[];
  driveFolderId?: string | null;
  drivePollInterval: number;
  openaiModel: string;
  lineChannelSecret?: string | null;
  lineChannelAccessToken?: string | null;
  lineEnabled?: boolean;
  lineAutoSendEnabled?: boolean;
  emailAutoSendEnabled?: boolean;
  emailSendMethod?: "gmail" | "smtp";
  gmailFromEmail?: string | null;
  smtpHost?: string | null;
  smtpPort?: number;
  smtpUser?: string | null;
  smtpPass?: string | null;
  smtpFrom?: string | null;
  autoRetryEnabled?: boolean;
  maxRetryAttempts?: number;
  retryIntervalMinutes?: number;
  gbpAutoPostEnabled?: boolean;
  gbpAccountId?: string | null;
  gbpLocationId?: string | null;
  gbpLocationName?: string | null;
}

export interface SubscriberLocation {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  lat: number;
  lng: number;
  city: string | null;
  region: string | null;
  country: string | null;
  label: string | null;
  subscribedAt: string;
}

export interface ManagedUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
  loginCode: string | null;
  createdAt: string;
}

export interface ReviewRequest {
  id: string;
  customerName: string;
  completionDate: string;
  lineUserId?: string | null;
  customerEmail?: string | null;
  reviewUrl?: string | null;
  thankMessage?: string | null;
  reviewMessage?: string | null;
  followUpMessage?: string | null;
  scheduledSendDate?: string | null;
  thankScheduledDate?: string | null;
  reviewScheduledDate?: string | null;
  followUpScheduledDate?: string | null;
  thankSentAt?: string | null;
  reviewSentAt?: string | null;
  followUpSentAt?: string | null;
  sendError?: string | null;
  sendStatus: "DRAFT" | "SCHEDULED" | "SENT" | "CANCELLED";
  createdAt: string;
}

export const STATUS_LABELS: Record<PostStatus, string> = {
  NOT_CREATED: "素材登録済み",
  AI_GENERATED: "AI生成済み",
  PENDING_REVIEW: "確認待ち",
  APPROVED: "承認済み",
  READY_TO_POST: "投稿準備済み",
  POSTED: "投稿済み",
  REJECTED: "却下",
  CANCELLED: "キャンセル",
  ERROR: "エラー",
};

export const SOURCE_LABELS = {
  GOOGLE_DRIVE: "Googleドライブ",
  LINE: "LINE",
  MANUAL: "手動",
};
