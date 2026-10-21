"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SavedDesignsPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadList = () => {
    setLoading(true);
    fetch("/api/v1/saved-designs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load saved designs");
        return res.json();
      })
      .then((json) => {
        setList(Array.isArray(json?.data) ? json.data : []);
        setError(null);
      })
      .catch((err) => {
        setError(err?.message || "Error loading designs");
        setList([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleDelete = async (id, boxName) => {
    if (!confirm(`Delete design "${boxName || "ID " + id}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/v1/saved-designs/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to delete");
      }
      setList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err?.message || "Error deleting design");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-6 px-4">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Saved Designs</h1>
        <p className="text-gray-600 mt-1">
          Box designs saved from the custom tool. Click a link to open and edit the design.
        </p>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && list.length === 0 && (
        <p className="text-gray-500">No saved designs yet. Save a design from the custom tool (Design panel → Save Design).</p>
      )}

      {!loading && list.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 font-semibold text-gray-700">ID</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Box name</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Material</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Link</th>
                <th className="py-3 px-4 font-semibold text-gray-700 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                  <td className="py-3 px-4 text-gray-700">{item.id}</td>
                  <td className="py-3 px-4 text-gray-700">{item.box_name}</td>
                  <td className="py-3 px-4 text-gray-600">{item.materail}</td>
                  <td className="py-3 px-4">
                    <Link
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-headingTxtColor font-medium hover:underline"
                    >
                      Open design
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.box_name)}
                      disabled={deletingId === item.id}
                      className="text-red-600 hover:text-red-800 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === item.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
