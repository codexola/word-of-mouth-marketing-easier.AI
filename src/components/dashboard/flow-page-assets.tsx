"use client";

import Image from "next/image";
import { FLOW_IMAGES, PAGE_FLOW_ASSETS, type FlowImageKey } from "@/lib/flow-images";
import { useApp } from "@/providers/app-provider";

interface FlowPageAssetsProps {
  page: keyof typeof PAGE_FLOW_ASSETS;
}

const assetLabels: Record<FlowImageKey, { ja: string; en: string }> = {
  drive: { ja: "Googleドライブ", en: "Google Drive" },
  line: { ja: "LINE", en: "LINE" },
  dashboardUi: { ja: "ダッシュボード", en: "Dashboard" },
  editPhoto: { ja: "現場写真", en: "Field photos" },
  openai: { ja: "OpenAI", en: "OpenAI" },
  gbp: { ja: "GBP", en: "GBP" },
  team: { ja: "チーム", en: "Team" },
  reviewCard: { ja: "口コミ依頼", en: "Reviews" },
  schedule: { ja: "スケジュール", en: "Schedule" },
  analytics: { ja: "分析", en: "Analytics" },
  templates: { ja: "テンプレート", en: "Templates" },
  insight: { ja: "ヒント", en: "Insights" },
  camera: { ja: "カメラ", en: "Camera" },
  monitor: { ja: "管理画面", en: "Console" },
  database: { ja: "データ保存", en: "Database" },
  growth: { ja: "成長", en: "Growth" },
  sample: { ja: "フロー図", en: "Flow diagram" },
};

export function FlowPageAssets({ page }: FlowPageAssetsProps) {
  const { locale } = useApp();
  const keys = PAGE_FLOW_ASSETS[page];
  if (!keys?.length) return null;

  return (
    <div className="flow-page-assets dash-card--2d">
      <div className="flow-page-assets__grid">
        {keys.map((key) => {
          const label = assetLabels[key][locale];
          return (
            <div key={key} className="flow-page-assets__item" title={label}>
              <Image
                src={FLOW_IMAGES[key]}
                alt={label}
                width={56}
                height={56}
                className="flow-page-assets__img"
                unoptimized
              />
              <span className="flow-page-assets__label">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
