"use client";

import { useEffect, useState } from "react";
import { APIProvider, Map, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import { api, type SubscriberLocation } from "@/lib/api";
import { useApp } from "@/providers/app-provider";

const DEFAULT_CENTER = { lat: 35.6762, lng: 139.6503 };
const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

interface Props {
  serviceAreas?: string[];
  className?: string;
}

export function SubscriberLocationsMap({ serviceAreas = [], className }: Props) {
  const { t } = useApp();
  const [subscribers, setSubscribers] = useState<SubscriberLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SubscriberLocation | null>(null);

  useEffect(() => {
    api
      .getSubscriberLocations()
      .then((res) => setSubscribers(res.items))
      .catch(() => setSubscribers([]))
      .finally(() => setLoading(false));
  }, []);

  const center =
    subscribers.length > 0
      ? { lat: subscribers[0].lat, lng: subscribers[0].lng }
      : DEFAULT_CENTER;

  if (!MAPS_KEY) {
    return (
      <div className={`subscriber-map-fallback dash-card--2d ${className ?? ""}`}>
        <p className="small fw-semibold mb-2">{t.map.title}</p>
        <p className="small text-muted mb-3">{t.map.apiKeyMissing}</p>
        {loading ? (
          <p className="small">{t.common.loading}</p>
        ) : subscribers.length === 0 ? (
          <p className="small text-muted">{t.map.noSubscribers}</p>
        ) : (
          <ul className="list-unstyled small mb-0">
            {subscribers.map((s) => (
              <li key={s.id} className="mb-2 p-2 border rounded" style={{ borderColor: "var(--bs-border-color)" }}>
                <strong>{s.name}</strong> — {s.label || t.map.unknownLocation}
                <br />
                <span className="text-muted">{s.email}</span>
              </li>
            ))}
          </ul>
        )}
        {serviceAreas.length > 0 && (
          <p className="small mt-3 mb-0">
            <span className="fw-semibold">{t.settings.areas}:</span> {serviceAreas.join("、")}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <APIProvider apiKey={MAPS_KEY}>
        <div className="subscriber-map-wrap">
          {loading && <p className="subscriber-map-loading small">{t.common.loading}</p>}
          <Map
            defaultCenter={center}
            defaultZoom={subscribers.length === 1 ? 10 : 6}
            gestureHandling="greedy"
            disableDefaultUI={false}
            className="subscriber-map"
          >
            {subscribers.map((s) => (
              <Marker
                key={s.id}
                position={{ lat: s.lat, lng: s.lng }}
                onClick={() => setSelected(s)}
                title={s.name}
              />
            ))}
            {selected && (
              <InfoWindow
                position={{ lat: selected.lat, lng: selected.lng }}
                onCloseClick={() => setSelected(null)}
              >
                <div className="small">
                  <p className="fw-bold mb-1">{selected.name}</p>
                  <p className="mb-1">{selected.label || t.map.unknownLocation}</p>
                  <p className="text-muted mb-0">{selected.email}</p>
                </div>
              </InfoWindow>
            )}
          </Map>
        </div>
      </APIProvider>
      <p className="small text-muted mt-2 mb-0">{t.map.subscriberHint}</p>
      {serviceAreas.length > 0 && (
        <div className="d-flex flex-wrap gap-1 mt-2">
          {serviceAreas.map((area) => (
            <span key={area} className="dash-chip">{area}</span>
          ))}
        </div>
      )}
      {!loading && subscribers.length === 0 && (
        <p className="small text-muted mt-2">{t.map.noSubscribers}</p>
      )}
    </div>
  );
}
