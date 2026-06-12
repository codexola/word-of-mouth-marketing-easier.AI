"use client";

import { useCallback, useEffect, useState } from "react";
import { X, Users, Trash2 } from "lucide-react";
import { api, ApiError, type ManagedUser } from "@/lib/api";
import { useApp } from "@/providers/app-provider";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function DeveloperUserManagementDialog({ open, onClose }: Props) {
  const { t } = useApp();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    role: "USER" as "ADMIN" | "USER",
  });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.getUsers();
      setUsers(res.items);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.common.error);
    } finally {
      setLoading(false);
    }
  }, [t.common.error]);

  useEffect(() => {
    if (open) {
      loadUsers();
      setSuccess("");
      setError("");
    }
  }, [open, loadUsers]);

  const handleDelete = async (user: ManagedUser) => {
    const message = t.developer.confirmDelete
      .replace("{name}", user.name)
      .replace("{email}", user.email);
    if (!window.confirm(message)) return;

    setDeletingId(user.id);
    setError("");
    setSuccess("");
    try {
      await api.deleteUser(user.id);
      setSuccess(t.developer.userDeleted);
      await loadUsers();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.developer.deleteFailed);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.createUser(form);
      setForm({ email: "", password: "", name: "", role: "USER" });
      setSuccess(t.developer.userCreated);
      await loadUsers();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.common.error);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="dash-modal-backdrop" onClick={onClose}>
      <div className="dash-modal dash-modal--lg" role="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dash-modal__header">
          <div className="d-flex align-items-center gap-2">
            <Users size={20} className="text-primary" />
            <h2 className="dash-modal__title mb-0">{t.developer.title}</h2>
          </div>
          <button type="button" className="btn btn-sm btn-link p-0" onClick={onClose} aria-label={t.common.cancel}>
            <X size={22} />
          </button>
        </div>

        <div className="dash-modal__body">
          <p className="small text-muted mb-3">{t.developer.subtitle}</p>

          <form onSubmit={handleCreate} className="dash-card--2d p-3 mb-4">
            <p className="dash-form-section__title">{t.developer.addUser}</p>
            <div className="dash-form-grid dash-form-grid--2">
              <div>
                <label className="dash-label">{t.auth.email}</label>
                <input type="email" className="dash-input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
              </div>
              <div>
                <label className="dash-label">{t.developer.displayName}</label>
                <input type="text" className="dash-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="dash-label">{t.auth.password}</label>
                <input type="password" className="dash-input" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} minLength={6} required />
              </div>
              <div>
                <label className="dash-label">{t.developer.role}</label>
                <select className="dash-select" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "ADMIN" | "USER" }))}>
                  <option value="ADMIN">{t.developer.roleAdmin}</option>
                  <option value="USER">{t.developer.roleUser}</option>
                </select>
              </div>
            </div>
            <button type="submit" className="dash-btn dash-btn--primary dash-btn--sm mt-3" disabled={saving}>
              {saving ? t.common.loading : t.developer.createUser}
            </button>
          </form>

          {error && <div className="dash-alert dash-alert--danger mb-3">{error}</div>}
          {success && <div className="dash-alert dash-alert--success mb-3">{success}</div>}

          <p className="dash-form-section__title">{t.developer.userList}</p>
          {loading ? (
            <p className="small text-muted">{t.common.loading}</p>
          ) : users.length === 0 ? (
            <p className="dash-empty">{t.developer.noUsers}</p>
          ) : (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>{t.auth.email}</th>
                    <th>{t.developer.displayName}</th>
                    <th>{t.developer.role}</th>
                    <th>{t.developer.loginCode}</th>
                    <th>{t.developer.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="small">{u.email}</td>
                      <td className="small">{u.name}</td>
                      <td>
                        <span className={`dash-tag ${u.role === "ADMIN" ? "dash-tag--default" : "dash-tag--muted"}`}>
                          {u.role === "ADMIN" ? t.developer.roleAdmin : t.developer.roleUser}
                        </span>
                      </td>
                      <td className="font-monospace small">
                        {u.role === "USER" ? (u.loginCode ?? "—") : "—"}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="dash-btn dash-btn--danger dash-btn--sm"
                          onClick={() => handleDelete(u)}
                          disabled={deletingId === u.id}
                          aria-label={t.developer.deleteUser}
                        >
                          <Trash2 size={14} />
                          {deletingId === u.id ? t.common.loading : t.developer.deleteUser}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="dash-modal__footer">
          <button type="button" className="dash-btn dash-btn--outline" onClick={onClose}>{t.common.cancel}</button>
        </div>
      </div>
    </div>
  );
}
