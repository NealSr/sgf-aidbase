"use client";

import { useState } from "react";
import { supabase, Resource, Category } from "@/lib/supabase";

// Blank resource template for the "Add New" form
const EMPTY_RESOURCE = {
  name: "",
  category_id: "",
  description: "",
  address: "",
  city: "Springfield",
  state: "MO",
  zip: "",
  phone: "",
  website: "",
  email: "",
  hours: "",
  eligibility: "",
  languages: "English",
  tags: "",
  notes: "",
  latitude: "",
  longitude: "",
};

type FormData = typeof EMPTY_RESOURCE;

export default function AdminPage() {
  // Auth state — not persistent, refreshing logs you out
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Data state
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_RESOURCE);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch all resources and categories from Supabase
  async function loadData() {
    const [{ data: res }, { data: cats }] = await Promise.all([
      supabase.from("resources").select("*").order("name"),
      supabase.from("categories").select("*").order("display_order"),
    ]);
    setResources((res as Resource[]) ?? []);
    setCategories((cats as Category[]) ?? []);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const { valid } = await res.json();
    if (valid) {
      setAuthenticated(true);
      loadData(); // Fetch resources immediately after login
    } else {
      setAuthError("Incorrect password");
    }
  }

  function handleEdit(resource: Resource) {
    setEditingId(resource.id);
    setForm({
      name: resource.name,
      category_id: resource.category_id,
      description: resource.description ?? "",
      address: resource.address ?? "",
      city: resource.city ?? "Springfield",
      state: resource.state ?? "MO",
      zip: resource.zip ?? "",
      phone: resource.phone ?? "",
      website: resource.website ?? "",
      email: resource.email ?? "",
      hours: resource.hours ?? "",
      eligibility: resource.eligibility ?? "",
      languages: resource.languages ?? "English",
      tags: resource.tags?.join(", ") ?? "",
      notes: resource.notes ?? "",
      latitude: resource.latitude?.toString() ?? "",
      longitude: resource.longitude?.toString() ?? "",
    });
    setShowForm(true);
    setMessage("");
  }

  function handleAddNew() {
    setEditingId(null);
    setForm(EMPTY_RESOURCE);
    setShowForm(true);
    setMessage("");
  }

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    // Build the row data, converting types as needed
    const row = {
      name: form.name,
      category_id: form.category_id,
      description: form.description || null,
      address: form.address,
      city: form.city,
      state: form.state,
      zip: form.zip || null,
      phone: form.phone || null,
      website: form.website || null,
      email: form.email || null,
      hours: form.hours || null,
      eligibility: form.eligibility || null,
      languages: form.languages || null,
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : null,
      notes: form.notes || null,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
      is_active: true,
    };

    let error;
    if (editingId) {
      // Update existing resource
      ({ error } = await supabase
        .from("resources")
        .update(row)
        .eq("id", editingId));
    } else {
      // Insert new resource
      ({ error } = await supabase.from("resources").insert(row));
    }

    setSaving(false);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage(editingId ? "Resource updated!" : "Resource added!");
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_RESOURCE);
      await loadData();
    }
  }

  async function handleVerify(id: string) {
    const { error } = await supabase
      .from("resources")
      .update({ last_verified: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      setMessage(`Error verifying: ${error.message}`);
    } else {
      setMessage("Marked as verified today!");
      await loadData();
    }
  }

  // ---- Login screen ----
  if (!authenticated) {
    return (
      <div className="flex items-center justify-center py-20 px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6">Admin Access</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 rounded-lg border text-base mb-3"
            style={{
              background: "var(--search-bg)",
              borderColor: "var(--search-border)",
              color: "var(--foreground)",
            }}
          />
          {authError && (
            <p className="text-sm mb-3" style={{ color: "#c0392b" }}>
              {authError}
            </p>
          )}
          <button
            type="submit"
            className="w-full px-4 py-3 rounded-lg text-white font-medium"
            style={{ background: "var(--accent)" }}
          >
            Log In
          </button>
        </form>
      </div>
    );
  }

  // ---- Admin dashboard ----
  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Resource Admin</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 rounded-lg text-white font-medium text-sm"
          style={{ background: "var(--accent)" }}
        >
          + Add New Resource
        </button>
      </div>

      {/* Status message */}
      {message && (
        <div
          className="rounded-lg p-3 mb-4 text-sm"
          style={{
            background: message.startsWith("Error")
              ? "#fdecea"
              : "var(--accent-light)",
            color: message.startsWith("Error") ? "#c0392b" : "var(--accent)",
          }}
        >
          {message}
        </div>
      )}

      {/* Resource form (add/edit) */}
      {showForm && (
        <form
          onSubmit={handleSave}
          className="rounded-lg border p-6 mb-6"
          style={{
            background: "var(--card-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Resource" : "Add New Resource"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Name *"
              value={form.name}
              onChange={(v) => updateField("name", v)}
              required
            />
            <div>
              <label className="block text-sm font-medium mb-1">
                Category *
              </label>
              <select
                value={form.category_id}
                onChange={(e) => updateField("category_id", e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  background: "var(--search-bg)",
                  borderColor: "var(--search-border)",
                  color: "var(--foreground)",
                }}
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border text-sm resize-y"
                style={{
                  background: "var(--search-bg)",
                  borderColor: "var(--search-border)",
                  color: "var(--foreground)",
                }}
              />
            </div>
            <Field
              label="Address"
              value={form.address}
              onChange={(v) => updateField("address", v)}
            />
            <div className="grid grid-cols-3 gap-2">
              <Field
                label="City"
                value={form.city}
                onChange={(v) => updateField("city", v)}
              />
              <Field
                label="State"
                value={form.state}
                onChange={(v) => updateField("state", v)}
              />
              <Field
                label="ZIP"
                value={form.zip}
                onChange={(v) => updateField("zip", v)}
              />
            </div>
            <Field
              label="Phone"
              value={form.phone}
              onChange={(v) => updateField("phone", v)}
            />
            <Field
              label="Website"
              value={form.website}
              onChange={(v) => updateField("website", v)}
            />
            <Field
              label="Email"
              value={form.email}
              onChange={(v) => updateField("email", v)}
            />
            <Field
              label="Hours"
              value={form.hours}
              onChange={(v) => updateField("hours", v)}
            />
            <Field
              label="Eligibility"
              value={form.eligibility}
              onChange={(v) => updateField("eligibility", v)}
            />
            <Field
              label="Languages"
              value={form.languages}
              onChange={(v) => updateField("languages", v)}
            />
            <Field
              label="Tags (comma-separated)"
              value={form.tags}
              onChange={(v) => updateField("tags", v)}
            />
            <Field
              label="Notes"
              value={form.notes}
              onChange={(v) => updateField("notes", v)}
            />
            <Field
              label="Latitude"
              value={form.latitude}
              onChange={(v) => updateField("latitude", v)}
            />
            <Field
              label="Longitude"
              value={form.longitude}
              onChange={(v) => updateField("longitude", v)}
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg text-white font-medium text-sm"
              style={{
                background: saving ? "var(--muted-light)" : "var(--accent)",
              }}
            >
              {saving ? "Saving..." : editingId ? "Update Resource" : "Add Resource"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setForm(EMPTY_RESOURCE);
              }}
              className="px-4 py-2 rounded-lg border text-sm font-medium"
              style={{
                borderColor: "var(--card-border)",
                color: "var(--muted)",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Resource list */}
      <div
        className="rounded-lg border overflow-hidden"
        style={{
          borderColor: "var(--card-border)",
        }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr
              style={{
                background: "var(--warm-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                Category
              </th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                Last Verified
              </th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((r) => {
              const cat = categories.find((c) => c.id === r.category_id);
              return (
                <tr
                  key={r.id}
                  className="border-t"
                  style={{
                    borderColor: "var(--card-border)",
                    background: "var(--card-bg)",
                  }}
                >
                  <td className="px-4 py-3">
                    <span className="font-medium">{r.name}</span>
                    {/* Show category on mobile (hidden on desktop) */}
                    {cat && (
                      <span
                        className="block text-xs md:hidden mt-1"
                        style={{ color: "var(--muted)" }}
                      >
                        {cat.icon} {cat.name}
                      </span>
                    )}
                  </td>
                  <td
                    className="px-4 py-3 hidden md:table-cell"
                    style={{ color: "var(--muted)" }}
                  >
                    {cat ? `${cat.icon} ${cat.name}` : "—"}
                  </td>
                  <td
                    className="px-4 py-3 hidden md:table-cell"
                    style={{ color: "var(--muted)" }}
                  >
                    {r.last_verified
                      ? new Date(r.last_verified).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end flex-wrap">
                      <button
                        onClick={() => handleEdit(r)}
                        className="px-3 py-1 rounded text-xs font-medium border"
                        style={{
                          borderColor: "var(--accent)",
                          color: "var(--accent)",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleVerify(r.id)}
                        className="px-3 py-1 rounded text-xs font-medium text-white"
                        style={{ background: "var(--accent)" }}
                      >
                        Verify
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs mt-4" style={{ color: "var(--muted-light)" }}>
        {resources.length} resources total
      </p>
    </div>
  );
}

/** Simple text input field used in the admin form */
function Field({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 rounded-lg border text-sm"
        style={{
          background: "var(--search-bg)",
          borderColor: "var(--search-border)",
          color: "var(--foreground)",
        }}
      />
    </div>
  );
}
