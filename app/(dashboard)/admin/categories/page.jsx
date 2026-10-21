"use client";

import { useState, useEffect } from "react";
import { Button, Label, TextInput, Textarea } from "flowbite-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    fetch("/api/v1/categories")
      .then((res) => res.json())
      .then(({ data }) => {
        if (Array.isArray(data)) setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/v1/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categories),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json.message || "Failed to save");
        setSaving(false);
        return;
      }
      setMessage("Categories saved. Changes appear on the site after refresh.");
      setEditingIndex(null);
    } catch (e) {
      setMessage("Network error");
    }
    setSaving(false);
  };

  const updateCategory = (index, field, value) => {
    const next = [...categories];
    next[index] = { ...next[index], [field]: value };
    setCategories(next);
  };

  const updateFeature = (catIndex, featIndex, value) => {
    const next = [...categories];
    const features = [...(next[catIndex].features || [])];
    features[featIndex] = value;
    next[catIndex] = { ...next[catIndex], features };
    setCategories(next);
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Loading categories…</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-headingTxtColor">Site Categories</h1>
        <Button
          onClick={handleSave}
          disabled={saving}
          gradientDuoTone="pinkToOrange"
        >
          {saving ? "Saving…" : "Save to database"}
        </Button>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Categories are stored in the database. Image paths: use <code className="bg-gray-100 px-1 rounded">/products/yourfile.jpg</code> for files in <code className="bg-gray-100 px-1 rounded">public/products/</code>, or upload via Add Type and the path will be under <code className="bg-gray-100 px-1 rounded">/uploads/</code>.
      </p>
      {message && (
        <p className={`text-sm mb-4 ${message.startsWith("Categories saved") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
      <div className="space-y-6">
        {categories.map((cat, index) => (
          <div
            key={cat._id || index}
            className="border border-gray-200 rounded-lg p-4 bg-white"
          >
            <button
              type="button"
              onClick={() => setEditingIndex(editingIndex === index ? null : index)}
              className="w-full text-left font-semibold text-headingTxtColor flex justify-between"
            >
              {cat.cardboardname}
              <span>{editingIndex === index ? "▼" : "▶"}</span>
            </button>
            {editingIndex === index && (
              <div className="mt-4 space-y-3">
                <div>
                  <Label>ID (read-only)</Label>
                  <TextInput value={cat._id || ""} disabled />
                </div>
                <div>
                  <Label>Parent category ID (leave empty for top-level)</Label>
                  <TextInput
                    value={cat.parent_id ?? ""}
                    onChange={(e) => updateCategory(index, "parent_id", e.target.value || null)}
                    placeholder="e.g. 1 or leave empty"
                  />
                </div>
                <div>
                  <Label>Display name</Label>
                  <TextInput
                    value={cat.cardboardname || ""}
                    onChange={(e) => updateCategory(index, "cardboardname", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Heading</Label>
                  <TextInput
                    value={cat.heading || ""}
                    onChange={(e) => updateCategory(index, "heading", e.target.value)}
                    placeholder="Optional heading"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={cat.description || ""}
                    onChange={(e) => updateCategory(index, "description", e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Long description</Label>
                  <Textarea
                    value={cat.description_long || ""}
                    onChange={(e) => updateCategory(index, "description_long", e.target.value)}
                    rows={3}
                    placeholder="Optional longer description"
                  />
                </div>
                <div>
                  <Label>Image path (e.g. /products/name.jpg or /uploads/filename.jpg)</Label>
                  <TextInput
                    value={Array.isArray(cat.img) ? (cat.img[0] || "") : (cat.img || "")}
                    onChange={(e) => updateCategory(index, "img", e.target.value ? [e.target.value] : [])}
                    placeholder="/products/example.jpg"
                  />
                </div>
                <div>
                  <Label>Features (one per line)</Label>
                  {(cat.features || []).map((f, fi) => (
                    <TextInput
                      key={fi}
                      value={f}
                      onChange={(e) => updateFeature(index, fi, e.target.value)}
                      className="mb-2"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
