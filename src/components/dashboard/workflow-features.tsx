"use client";

import { DashboardIcon } from "@/components/icons/dashboard-icon";
import type { DashboardIconName } from "@/components/icons/svg-icons";
import { PageCard } from "@/components/layout/page-shell";
import { useApp } from "@/providers/app-provider";

const workflowIcons: DashboardIconName[] = ["upload", "ai", "edit", "gbp"];
const featureIcons: DashboardIconName[] = ["efficiency", "reviews", "team", "security"];

export function WorkflowFeatures() {
  const { t } = useApp();

  return (
    <div className="d-flex flex-column gap-3">
      <PageCard title={t.dashboard.workflow} subtitle={t.dashboard.workflowDesc}>
        <div className="row g-3">
          {t.login.workflowSteps.map((label, i) => (
            <div key={label} className="col-6 col-xl-3">
              <div className="dash-card--2d p-3 h-100 text-center" style={{ background: "#eff6ff" }}>
                <DashboardIcon name={workflowIcons[i]} alt={label} size={40} className="mx-auto mb-2" />
                <p className="small fw-semibold mb-0">{label}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-end mt-3">
          <DashboardIcon name="send" alt="send" size={28} />
        </div>
      </PageCard>

      <PageCard title={t.dashboard.featuresTitle} subtitle={t.dashboard.featuresDesc}>
        <div className="row g-3">
          {t.login.features.map((feature, i) => (
            <div key={feature.title} className="col-12 col-sm-6 col-lg-3">
              <div className="dash-card--3d p-3 h-100">
                <DashboardIcon name={featureIcons[i]} alt={feature.title} size={36} className="mb-2" />
                <p className="small fw-bold mb-1">{feature.title}</p>
                <p className="small text-muted mb-0">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </PageCard>
    </div>
  );
}
