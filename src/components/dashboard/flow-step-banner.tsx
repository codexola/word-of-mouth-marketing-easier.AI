"use client";

import Image from "next/image";
import { useApp } from "@/providers/app-provider";
import type { FlowStepId } from "@/lib/flow-images";
import { FLOW_IMAGES } from "@/lib/flow-images";

interface FlowStepBannerProps {
  steps: FlowStepId[];
  variant?: "mvp" | "expansion";
}

const stepImages: Record<FlowStepId, string> = {
  "mvp-1": FLOW_IMAGES.drive,
  "mvp-2": FLOW_IMAGES.openai,
  "mvp-3": FLOW_IMAGES.dashboardUi,
  "mvp-4": FLOW_IMAGES.editPhoto,
  "mvp-5": FLOW_IMAGES.gbp,
  "mvp-6": FLOW_IMAGES.database,
  "mvp-7": FLOW_IMAGES.growth,
  "exp-1": FLOW_IMAGES.reviewCard,
  "exp-2": FLOW_IMAGES.gbp,
  "exp-3": FLOW_IMAGES.team,
  "exp-4": FLOW_IMAGES.schedule,
  "exp-5": FLOW_IMAGES.analytics,
  "exp-6": FLOW_IMAGES.templates,
};

export function FlowStepBanner({ steps, variant = "mvp" }: FlowStepBannerProps) {
  const { t } = useApp();

  return (
    <div className={`flow-banner flow-banner--${variant}`}>
      <div className="flow-banner__label">
        {variant === "mvp" ? t.flow.mvpLabel : t.flow.expansionLabel}
      </div>
      <div className="flow-banner__steps">
        {steps.map((id) => {
          const step = t.flow.steps[id];
          return (
            <div key={id} className="flow-banner__step dash-card--3d">
              <div className="flow-banner__step-num">{step.num}</div>
              <div className="flow-banner__step-img-wrap">
                <Image
                  src={stepImages[id]}
                  alt=""
                  width={72}
                  height={72}
                  className="flow-banner__step-img"
                  unoptimized
                />
              </div>
              <p className="flow-banner__step-title">{step.title}</p>
              <p className="flow-banner__step-desc">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
