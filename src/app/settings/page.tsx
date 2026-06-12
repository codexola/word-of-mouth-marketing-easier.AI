"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Save, Plus, Link2, Unlink } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import Image from "next/image";
import { PageHeader, PageCard, PageLoading } from "@/components/layout/page-shell";
import { FlowStepBanner } from "@/components/dashboard/flow-step-banner";
import { FlowPageAssets } from "@/components/dashboard/flow-page-assets";
import { SubscriberLocationsMap } from "@/components/maps/subscriber-locations-map";
import { FLOW_IMAGES, PAGE_FLOW_STEPS } from "@/lib/flow-images";
import { api, AppSettings } from "@/lib/api";
import { useApp } from "@/providers/app-provider";

function SettingsContent() {
  const { t, isAuthenticated, authLoading } = useApp();
  const searchParams = useSearchParams();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [newArea, setNewArea] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [newNgWord, setNewNgWord] = useState("");
  const [lineStatus, setLineStatus] = useState<{
    enabled: boolean;
    configured: boolean;
    webhookUrl: string;
    autoSendEnabled?: boolean;
  } | null>(null);
  const [gbpStatus, setGbpStatus] = useState<{
    oauthConfigured: boolean;
    connected: boolean;
    autoPostEnabled: boolean;
    locationName?: string | null;
  } | null>(null);
  const [gbpLocations, setGbpLocations] = useState<
    { accountId: string; locationId: string; title: string; address?: string }[]
  >([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [gmailStatus, setGmailStatus] = useState<{
    oauthConfigured: boolean;
    connected: boolean;
    fromEmail?: string | null;
    sendMethod?: string;
  } | null>(null);

  const loadIntegrations = () => {
    api.getLineStatus().then(setLineStatus).catch(() => {});
    api.getGbpStatus().then(setGbpStatus).catch(() => {});
    api.getGmailStatus().then(setGmailStatus).catch(() => {});
  };

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    api.getSettings().then(setSettings).catch(() => {});
    loadIntegrations();
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    const gbp = searchParams.get("gbp");
    if (gbp === "connected") {
      alert(t.settings.gbpConnectedSuccess);
      loadIntegrations();
      api.getSettings().then(setSettings).catch(() => {});
    } else if (gbp === "error") {
      alert(t.settings.gbpConnectFailed);
    }
  }, [searchParams, t.settings.gbpConnectedSuccess, t.settings.gbpConnectFailed]);

  useEffect(() => {
    const gmail = searchParams.get("gmail");
    if (gmail === "connected") {
      alert(t.settings.gmailConnectedSuccess);
      loadIntegrations();
      api.getSettings().then(setSettings).catch(() => {});
    } else if (gmail === "error") {
      alert(t.settings.gmailConnectFailed);
    }
  }, [searchParams, t.settings.gmailConnectedSuccess, t.settings.gmailConnectFailed]);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await api.updateSettings(settings);
      setSettings(updated);
      alert(t.settings.saved);
    } catch {
      alert(t.settings.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  const addItem = (field: "serviceAreas" | "keywords" | "ngWords", value: string, clear: () => void) => {
    if (!settings || !value.trim()) return;
    setSettings({ ...settings, [field]: [...settings[field], value.trim()] });
    clear();
  };

  const removeItem = (field: "serviceAreas" | "keywords" | "ngWords", index: number) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: settings[field].filter((_, i) => i !== index) });
  };

  if (!settings) {
    return (
      <DashboardLayout>
        <PageLoading />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="dash-page">
        <PageHeader
          title={t.settings.title}
          subtitle={t.settings.subtitle}
          actions={
            <button type="button" className="dash-btn dash-btn--primary" onClick={handleSave} disabled={saving}>
              <Save size={16} />
              {saving ? t.common.loading : t.common.save}
            </button>
          }
        />

        <FlowStepBanner steps={PAGE_FLOW_STEPS.settings} variant="expansion" />
        <FlowPageAssets page="settings" />

        <div className="row g-3 g-lg-4">
          <div className="col-12 col-lg-6">
            <PageCard title={t.settings.basicInfo}>
              <div className="dash-form-grid">
                <div>
                  <label className="dash-label">{t.settings.gbpUrl}</label>
                  <input className="dash-input" value={settings.businessProfileUrl || ""} onChange={(e) => setSettings({ ...settings, businessProfileUrl: e.target.value })} />
                </div>
                <div>
                  <label className="dash-label">{t.settings.reviewUrl}</label>
                  <input className="dash-input" value={settings.reviewRequestUrl || ""} onChange={(e) => setSettings({ ...settings, reviewRequestUrl: e.target.value })} />
                </div>
                <div>
                  <label className="dash-label">{t.settings.driveFolder}</label>
                  <input className="dash-input" value={settings.driveFolderId || ""} onChange={(e) => setSettings({ ...settings, driveFolderId: e.target.value })} />
                </div>
                <div className="dash-form-grid dash-form-grid--2">
                  <div>
                    <label className="dash-label">{t.settings.pollInterval}</label>
                    <input type="number" min={1} max={60} className="dash-input" value={settings.drivePollInterval} onChange={(e) => setSettings({ ...settings, drivePollInterval: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="dash-label">{t.settings.openaiModel}</label>
                    <input className="dash-input" value={settings.openaiModel} onChange={(e) => setSettings({ ...settings, openaiModel: e.target.value })} />
                  </div>
                </div>
              </div>
            </PageCard>
          </div>

          <div className="col-12 col-lg-6">
            <PageCard title={t.settings.gbpTitle} subtitle={t.settings.gbpDesc}>
              <div className="dash-form-grid">
                {gbpStatus && !gbpStatus.oauthConfigured && (
                  <p className="small text-muted mb-0">{t.settings.gbpOAuthMissing}</p>
                )}
                {gbpStatus && (
                  <p className="small fw-semibold mb-0">
                    {gbpStatus.connected ? t.settings.gbpConnected : t.settings.gbpNotConnected}
                    {gbpStatus.locationName && ` — ${gbpStatus.locationName}`}
                  </p>
                )}
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="dash-btn dash-btn--primary dash-btn--sm"
                    disabled={!gbpStatus?.oauthConfigured}
                    onClick={async () => {
                      try {
                        const { url } = await api.getGbpAuthUrl();
                        window.location.href = url;
                      } catch (err) {
                        alert(err instanceof Error ? err.message : t.settings.gbpConnectFailed);
                      }
                    }}
                  >
                    <Link2 size={14} />
                    {t.settings.gbpConnect}
                  </button>
                  {gbpStatus?.connected && (
                    <button
                      type="button"
                      className="dash-btn dash-btn--outline dash-btn--sm"
                      onClick={async () => {
                        await api.disconnectGbp();
                        loadIntegrations();
                        api.getSettings().then(setSettings).catch(() => {});
                      }}
                    >
                      <Unlink size={14} />
                      {t.settings.gbpDisconnect}
                    </button>
                  )}
                </div>
                {gbpStatus?.connected && (
                  <>
                    <button
                      type="button"
                      className="dash-btn dash-btn--outline dash-btn--sm"
                      onClick={async () => {
                        try {
                          const res = await api.getGbpLocations();
                          setGbpLocations(res.items);
                          if (res.items.length === 0) {
                            alert(t.settings.gbpNoLocations);
                          }
                        } catch (err) {
                          alert(err instanceof Error ? err.message : t.settings.gbpLoadLocationsFailed);
                        }
                      }}
                    >
                      {t.settings.gbpLoadLocations}
                    </button>
                    {gbpLocations.length > 0 && (
                      <div>
                        <label className="dash-label">{t.settings.gbpSelectLocation}</label>
                        <select
                          className="dash-select"
                          value={selectedLocation}
                          onChange={(e) => setSelectedLocation(e.target.value)}
                        >
                          <option value="">—</option>
                          {gbpLocations.map((loc) => (
                            <option key={`${loc.accountId}-${loc.locationId}`} value={`${loc.accountId}|${loc.locationId}|${loc.title}`}>
                              {loc.title}{loc.address ? ` (${loc.address})` : ""}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="dash-btn dash-btn--outline dash-btn--sm mt-2"
                          onClick={async () => {
                            const [accountId, locationId, locationTitle] = selectedLocation.split("|");
                            if (!accountId || !locationId) {
                              alert(t.settings.gbpLocationRequired);
                              return;
                            }
                            await api.selectGbpLocation({ accountId, locationId, locationTitle });
                            loadIntegrations();
                            api.getSettings().then(setSettings).catch(() => {});
                          }}
                        >
                          {t.common.save}
                        </button>
                      </div>
                    )}
                  </>
                )}
                <label className="d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.gbpAutoPostEnabled === true}
                    onChange={(e) => setSettings({ ...settings, gbpAutoPostEnabled: e.target.checked })}
                    className="form-check-input"
                  />
                  <span className="small fw-semibold">{t.settings.gbpAutoPost}</span>
                </label>
              </div>
            </PageCard>
          </div>

          <div className="col-12 col-lg-6">
            <PageCard title={t.settings.tone} subtitle={t.settings.toneDesc}>
              <textarea className="dash-textarea" rows={8} value={settings.toneDescription} onChange={(e) => setSettings({ ...settings, toneDescription: e.target.value })} />
            </PageCard>
          </div>

          <div className="col-12">
            <PageCard title={t.settings.lineTitle} subtitle={t.settings.lineDesc}>
              <div className="dash-form-grid">
                <label className="d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.lineEnabled !== false}
                    onChange={(e) => setSettings({ ...settings, lineEnabled: e.target.checked })}
                    className="form-check-input"
                  />
                  <span className="small fw-semibold">{t.settings.lineEnabled}</span>
                </label>
                <label className="d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.lineAutoSendEnabled === true}
                    onChange={(e) => setSettings({ ...settings, lineAutoSendEnabled: e.target.checked })}
                    className="form-check-input"
                  />
                  <span className="small fw-semibold">{t.settings.lineAutoSend}</span>
                </label>
                <p className="small text-muted mb-0">{t.settings.lineAutoSendDesc}</p>
                <div className="dash-form-grid dash-form-grid--2">
                  <div>
                    <label className="dash-label">{t.settings.lineSecret}</label>
                    <input type="password" className="dash-input" value={settings.lineChannelSecret || ""} onChange={(e) => setSettings({ ...settings, lineChannelSecret: e.target.value })} placeholder="LINE Channel Secret" />
                  </div>
                  <div>
                    <label className="dash-label">{t.settings.lineToken}</label>
                    <input type="password" className="dash-input" value={settings.lineChannelAccessToken || ""} onChange={(e) => setSettings({ ...settings, lineChannelAccessToken: e.target.value })} placeholder="LINE Channel Access Token" />
                  </div>
                </div>
                {lineStatus && (
                  <div className="dash-card--2d p-3">
                    <p className="small fw-bold mb-1">{t.settings.lineStatus}</p>
                    <p className="small text-muted mb-2">
                      {lineStatus.configured
                        ? lineStatus.enabled ? t.settings.lineConfigured : t.settings.lineDisabled
                        : t.settings.lineNotConfigured}
                    </p>
                    <label className="dash-label">{t.settings.lineWebhook}</label>
                    <div className="d-flex gap-2">
                      <input className="dash-input" readOnly value={lineStatus.webhookUrl} />
                      <button type="button" className="dash-btn dash-btn--outline" onClick={() => { navigator.clipboard.writeText(lineStatus.webhookUrl); alert(t.settings.lineCopyWebhook); }}>
                        {t.common.copy}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </PageCard>
          </div>

          <div className="col-12">
            <PageCard title={t.settings.emailTitle} subtitle={t.settings.emailDesc}>
              <div className="dash-form-grid">
                <label className="d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.emailAutoSendEnabled === true}
                    onChange={(e) => setSettings({ ...settings, emailAutoSendEnabled: e.target.checked })}
                    className="form-check-input"
                  />
                  <span className="small fw-semibold">{t.settings.emailAutoSend}</span>
                </label>
                <p className="small text-muted mb-0">{t.settings.emailAutoSendDesc}</p>
                <div>
                  <label className="dash-label">{t.settings.emailSendMethod}</label>
                  <div className="d-flex flex-wrap gap-3">
                    <label className="d-flex align-items-center gap-2">
                      <input
                        type="radio"
                        name="emailSendMethod"
                        checked={(settings.emailSendMethod || "gmail") === "gmail"}
                        onChange={() => setSettings({ ...settings, emailSendMethod: "gmail" })}
                      />
                      <span className="small">{t.settings.emailSendGmail}</span>
                    </label>
                    <label className="d-flex align-items-center gap-2">
                      <input
                        type="radio"
                        name="emailSendMethod"
                        checked={settings.emailSendMethod === "smtp"}
                        onChange={() => setSettings({ ...settings, emailSendMethod: "smtp" })}
                      />
                      <span className="small">{t.settings.emailSendSmtp}</span>
                    </label>
                  </div>
                </div>
                {(settings.emailSendMethod || "gmail") === "gmail" && (
                  <div className="dash-card--2d p-3">
                    {gmailStatus && !gmailStatus.oauthConfigured && (
                      <p className="small text-muted mb-2">{t.settings.gmailOAuthMissing}</p>
                    )}
                    {gmailStatus && (
                      <p className="small fw-semibold mb-2">
                        {gmailStatus.connected ? t.settings.gmailConnected : t.settings.gmailNotConnected}
                        {gmailStatus.fromEmail && ` — ${gmailStatus.fromEmail}`}
                      </p>
                    )}
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="dash-btn dash-btn--primary dash-btn--sm"
                        disabled={!gmailStatus?.oauthConfigured}
                        onClick={async () => {
                          try {
                            const { url } = await api.getGmailAuthUrl();
                            window.location.href = url;
                          } catch (err) {
                            alert(err instanceof Error ? err.message : t.settings.gmailConnectFailed);
                          }
                        }}
                      >
                        <Link2 size={14} />
                        {t.settings.gmailConnect}
                      </button>
                      {gmailStatus?.connected && (
                        <button
                          type="button"
                          className="dash-btn dash-btn--outline dash-btn--sm"
                          onClick={async () => {
                            await api.disconnectGmail();
                            loadIntegrations();
                            api.getSettings().then(setSettings).catch(() => {});
                          }}
                        >
                          <Unlink size={14} />
                          {t.settings.gmailDisconnect}
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {settings.emailSendMethod === "smtp" && (
                  <div className="dash-form-grid dash-form-grid--2">
                    <div>
                      <label className="dash-label">{t.settings.smtpHost}</label>
                      <input className="dash-input" value={settings.smtpHost || ""} onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })} placeholder="smtp.example.com" />
                    </div>
                    <div>
                      <label className="dash-label">{t.settings.smtpPort}</label>
                      <input type="number" className="dash-input" value={settings.smtpPort ?? 587} onChange={(e) => setSettings({ ...settings, smtpPort: Number(e.target.value) })} />
                    </div>
                    <div>
                      <label className="dash-label">{t.settings.smtpUser}</label>
                      <input className="dash-input" value={settings.smtpUser || ""} onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })} />
                    </div>
                    <div>
                      <label className="dash-label">{t.settings.smtpPass}</label>
                      <input type="password" className="dash-input" value={settings.smtpPass || ""} onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })} />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label className="dash-label">{t.settings.smtpFrom}</label>
                      <input className="dash-input" value={settings.smtpFrom || ""} onChange={(e) => setSettings({ ...settings, smtpFrom: e.target.value })} placeholder="noreply@example.com" />
                    </div>
                  </div>
                )}
              </div>
            </PageCard>
          </div>

          <div className="col-12 col-lg-6">
            <PageCard title={t.settings.autoRetry} subtitle={t.settings.autoRetryDesc}>
              <div className="dash-form-grid">
                <label className="d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.autoRetryEnabled !== false}
                    onChange={(e) => setSettings({ ...settings, autoRetryEnabled: e.target.checked })}
                    className="form-check-input"
                  />
                  <span className="small fw-semibold">{t.settings.autoRetry}</span>
                </label>
                <div className="dash-form-grid dash-form-grid--2">
                  <div>
                    <label className="dash-label">{t.settings.maxRetryAttempts}</label>
                    <input type="number" min={1} max={20} className="dash-input" value={settings.maxRetryAttempts ?? 3} onChange={(e) => setSettings({ ...settings, maxRetryAttempts: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="dash-label">{t.settings.retryIntervalMinutes}</label>
                    <input type="number" min={5} max={1440} className="dash-input" value={settings.retryIntervalMinutes ?? 30} onChange={(e) => setSettings({ ...settings, retryIntervalMinutes: Number(e.target.value) })} />
                  </div>
                </div>
              </div>
            </PageCard>
          </div>

          <div className="col-12 col-lg-6">
            <PageCard title={t.settings.areas} subtitle={t.map.title}>
              <SubscriberLocationsMap serviceAreas={settings.serviceAreas} className="mb-3" />
              <div className="d-flex flex-wrap gap-2 mb-3">
                {settings.serviceAreas.map((area, i) => (
                  <span key={i} className="dash-chip">
                    {area}
                    <button type="button" onClick={() => removeItem("serviceAreas", i)} aria-label="remove">×</button>
                  </span>
                ))}
              </div>
              <div className="d-flex gap-2">
                <input className="dash-input" placeholder="〇〇市" value={newArea} onChange={(e) => setNewArea(e.target.value)} />
                <button type="button" className="dash-btn dash-btn--outline" onClick={() => addItem("serviceAreas", newArea, () => setNewArea(""))}>
                  <Plus size={16} />
                </button>
              </div>
            </PageCard>
          </div>

          <div className="col-12 col-lg-6">
            <PageCard title={`${t.settings.keywords} / ${t.settings.ngWords}`}>
              <div className="mb-4">
                <label className="dash-label">{t.settings.keywords}</label>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {settings.keywords.map((kw, i) => (
                    <span key={i} className="dash-chip dash-chip--success">
                      {kw}<button type="button" onClick={() => removeItem("keywords", i)}>×</button>
                    </span>
                  ))}
                </div>
                <div className="d-flex gap-2">
                  <input className="dash-input" value={newKeyword} onChange={(e) => setNewKeyword(e.target.value)} />
                  <button type="button" className="dash-btn dash-btn--outline" onClick={() => addItem("keywords", newKeyword, () => setNewKeyword(""))}><Plus size={16} /></button>
                </div>
              </div>
              <div>
                <label className="dash-label">{t.settings.ngWords}</label>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {settings.ngWords.map((word, i) => (
                    <span key={i} className="dash-chip dash-chip--danger">
                      {word}<button type="button" onClick={() => removeItem("ngWords", i)}>×</button>
                    </span>
                  ))}
                </div>
                <div className="d-flex gap-2">
                  <input className="dash-input" value={newNgWord} onChange={(e) => setNewNgWord(e.target.value)} />
                  <button type="button" className="dash-btn dash-btn--outline" onClick={() => addItem("ngWords", newNgWord, () => setNewNgWord(""))}><Plus size={16} /></button>
                </div>
              </div>
            </PageCard>
          </div>

          <div className="col-12 col-lg-4">
            <PageCard title={t.flow.expansionSteps[5].title} variant="flat">
              <div className="text-center mb-3">
                <Image src={FLOW_IMAGES.templates} alt="" width={200} height={120} className="img-fluid" unoptimized style={{ maxHeight: "8rem", objectFit: "contain" }} />
              </div>
              <p className="small text-muted mb-0">{t.flow.expansionSteps[5].desc}</p>
            </PageCard>
          </div>

          <div className="col-12">
            <PageCard title={t.settings.samplePosts} subtitle={t.settings.sampleDesc}>
              <div className="d-flex flex-column gap-3">
                {(settings.samplePosts || []).map((sample, i) => (
                  <div key={i} className="dash-card--2d p-3">
                    <div className="dash-form-grid">
                      <div>
                        <label className="dash-label">{t.postDetail.postTitle}</label>
                        <input
                          className="dash-input"
                          value={sample.title}
                          onChange={(e) => {
                            const samplePosts = [...(settings.samplePosts || [])];
                            samplePosts[i] = { ...samplePosts[i], title: e.target.value };
                            setSettings({ ...settings, samplePosts });
                          }}
                        />
                      </div>
                      <div>
                        <label className="dash-label">{t.postDetail.postBody}</label>
                        <textarea
                          className="dash-textarea"
                          rows={4}
                          value={sample.body}
                          onChange={(e) => {
                            const samplePosts = [...(settings.samplePosts || [])];
                            samplePosts[i] = { ...samplePosts[i], body: e.target.value };
                            setSettings({ ...settings, samplePosts });
                          }}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="dash-btn dash-btn--outline dash-btn--sm mt-2"
                      onClick={() => setSettings({
                        ...settings,
                        samplePosts: (settings.samplePosts || []).filter((_, idx) => idx !== i),
                      })}
                    >
                      × {t.common.remove}
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="dash-btn dash-btn--outline"
                  onClick={() => setSettings({
                    ...settings,
                    samplePosts: [...(settings.samplePosts || []), { title: "", body: "" }],
                  })}
                >
                  <Plus size={16} />
                  {t.settings.addSample}
                </button>
              </div>
            </PageCard>
          </div>

          <div className="col-12 col-lg-8">
            <PageCard title={t.settings.services} subtitle={t.settings.servicesDesc}>
              <div className="d-flex flex-column gap-3">
                {settings.services.map((service, i) => (
                  <div key={i} className="dash-card--2d p-3">
                    <div className="dash-form-grid dash-form-grid--2">
                      <div>
                        <label className="dash-label">{t.settings.serviceName}</label>
                        <input className="dash-input" value={service.name} onChange={(e) => {
                          const services = [...settings.services];
                          services[i] = { ...services[i], name: e.target.value };
                          setSettings({ ...settings, services });
                        }} />
                      </div>
                      <div>
                        <label className="dash-label">{t.settings.serviceKeywords}</label>
                        <input className="dash-input" value={service.keywords?.join("、") || ""} onChange={(e) => {
                          const services = [...settings.services];
                          services[i] = { ...services[i], keywords: e.target.value.split(/[、,]/).map((k) => k.trim()).filter(Boolean) };
                          setSettings({ ...settings, services });
                        }} />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" className="dash-btn dash-btn--outline" onClick={() => setSettings({ ...settings, services: [...settings.services, { name: "", keywords: [] }] })}>
                  <Plus size={16} />
                  {t.settings.addService}
                </button>
              </div>
            </PageCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <SettingsContent />
    </Suspense>
  );
}
