/** Flow illustration assets from /public/image — mapped to MVP & expansion steps */
export const FLOW_IMAGES = {
  drive: "/image/1.png",
  line: "/image/2.png",
  dashboardUi: "/image/3.png",
  editPhoto: "/image/4.png",
  openai: "/image/5.png",
  gbp: "/image/6.png",
  team: "/image/7.png",
  reviewCard: "/image/8.png",
  schedule: "/image/9.png",
  analytics: "/image/10.png",
  templates: "/image/12.png",
  insight: "/image/13.png",
  camera: "/image/14.png",
  monitor: "/image/15.png",
  database: "/image/16.png",
  growth: "/image/17.png",
  sample: "/image/sample.png",
} as const;

export type FlowImageKey = keyof typeof FLOW_IMAGES;

export type FlowStepId =
  | "mvp-1" | "mvp-2" | "mvp-3" | "mvp-4" | "mvp-5" | "mvp-6" | "mvp-7"
  | "exp-1" | "exp-2" | "exp-3" | "exp-4" | "exp-5" | "exp-6";

export const PAGE_FLOW_STEPS: Record<string, FlowStepId[]> = {
  dashboard: ["mvp-1", "mvp-2", "mvp-3"],
  posts: ["mvp-4", "mvp-5"],
  history: ["mvp-6", "mvp-7"],
  reviews: ["exp-1"],
  settings: ["exp-2", "exp-4", "exp-6"],
  account: ["exp-3"],
};

/** Page-specific flow images — ensures every asset is used in context */
export const PAGE_FLOW_ASSETS: Record<string, FlowImageKey[]> = {
  dashboard: ["drive", "line", "dashboardUi", "monitor", "openai"],
  posts: ["editPhoto", "camera", "openai", "gbp"],
  history: ["database", "growth", "analytics"],
  reviews: ["reviewCard", "line", "insight"],
  settings: ["gbp", "schedule", "templates", "insight"],
  account: ["team", "insight"],
  postDetail: ["editPhoto", "camera", "gbp"],
};
