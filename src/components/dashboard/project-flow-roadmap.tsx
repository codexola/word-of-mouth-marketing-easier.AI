"use client";

import Image from "next/image";
import { FLOW_IMAGES } from "@/lib/flow-images";
import { useApp } from "@/providers/app-provider";

const mvpImages = [
  FLOW_IMAGES.openai,
  FLOW_IMAGES.dashboardUi,
  FLOW_IMAGES.editPhoto,
  FLOW_IMAGES.gbp,
  FLOW_IMAGES.database,
  FLOW_IMAGES.growth,
] as const;

const expImages = [
  FLOW_IMAGES.reviewCard,
  FLOW_IMAGES.gbp,
  FLOW_IMAGES.team,
  FLOW_IMAGES.schedule,
  FLOW_IMAGES.analytics,
  FLOW_IMAGES.templates,
] as const;

export function ProjectFlowRoadmap() {
  const { t } = useApp();

  return (
    <div className="flow-roadmap">
      <section className="flow-roadmap__section flow-roadmap__section--mvp">
        <h2 className="flow-roadmap__heading">{t.flow.mvpTitle}</h2>
        <div className="flow-roadmap__grid">
          {t.flow.mvpSteps.map((step, i) => (
            <div key={step.num} className="flow-roadmap__card dash-card--3d">
              <span className="flow-roadmap__num">{step.num}</span>
              <div className="flow-roadmap__img-row">
                {i === 0 ? (
                  <>
                    <Image src={FLOW_IMAGES.drive} alt="" width={48} height={48} unoptimized className="flow-roadmap__img" />
                    <Image src={FLOW_IMAGES.line} alt="" width={48} height={48} unoptimized className="flow-roadmap__img" />
                  </>
                ) : (
                  <Image src={mvpImages[i - 1]} alt="" width={56} height={56} unoptimized className="flow-roadmap__img" />
                )}
              </div>
              <p className="flow-roadmap__card-title">{step.title}</p>
              <p className="flow-roadmap__card-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flow-roadmap__section flow-roadmap__section--exp">
        <h2 className="flow-roadmap__heading">{t.flow.expansionTitle}</h2>
        <div className="flow-roadmap__grid flow-roadmap__grid--exp">
          {t.flow.expansionSteps.map((step, i) => (
            <div key={step.num} className="flow-roadmap__card dash-card--2d">
              <span className="flow-roadmap__num flow-roadmap__num--exp">{step.num}</span>
              <Image src={expImages[i]} alt="" width={52} height={52} unoptimized className="flow-roadmap__img mb-2" />
              <p className="flow-roadmap__card-title">{step.title}</p>
              <p className="flow-roadmap__card-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flow-roadmap__sample-wrap dash-card--2d">
        <p className="flow-roadmap__sample-label">{t.flow.referenceDiagram}</p>
        <Image
          src={FLOW_IMAGES.sample}
          alt={t.flow.referenceDiagram}
          width={1200}
          height={400}
          className="flow-roadmap__sample-img"
          unoptimized
          priority
        />
      </div>

      <div className="flow-roadmap__timeline">
        {t.flow.timeline.map((item, i) => (
          <span key={item} className="flow-roadmap__timeline-item">
            {i > 0 && <span className="flow-roadmap__timeline-arrow" aria-hidden>→</span>}
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
