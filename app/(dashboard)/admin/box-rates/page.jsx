"use client";

import { useState, useEffect } from "react";
import { Button, TextInput, Label } from "flowbite-react";
import Swal from "sweetalert2";

const MATERIALS = ["Kraft", "White", "Dreamcoat"];

const DEFAULT_DOLLAR_RATE = 280;
const DEFAULT_RATES = { Kraft: 100, White: 200, Dreamcoat: 300 };

export default function BoxRatesPage() {
  const [rates, setRates] = useState({ ...DEFAULT_RATES });
  const [dollarRate, setDollarRate] = useState(DEFAULT_DOLLAR_RATE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/v1/box-material-rates")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        const data = json?.data;
        const dr = json?.dollarRate;
        if (data && typeof data === "object") {
          setRates((prev) => ({ ...DEFAULT_RATES, ...prev, ...data }));
        }
        if (dr != null && !Number.isNaN(Number(dr))) {
          setDollarRate(Number(dr));
        }
        setFetchError(null);
      })
      .catch((err) => {
        if (!cancelled) {
          setFetchError(err?.message || "Could not load rates");
          setRates({ ...DEFAULT_RATES });
          setDollarRate(DEFAULT_DOLLAR_RATE);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleChange = (name, value) => {
    const n = Number(value);
    if (value === "" || !Number.isNaN(n)) {
      setRates((prev) => ({ ...prev, [name]: value === "" ? "" : n }));
    }
  };

  const handleDollarRateChange = (e) => {
    const v = e.target.value;
    if (v === "") setDollarRate("");
    else {
      const n = Number(v);
      if (!Number.isNaN(n) && n >= 0) setDollarRate(n);
    }
  };

  const handleSave = async () => {
    const numDollar = Number(dollarRate);
    const finalDollar = (numDollar > 0 && !Number.isNaN(numDollar)) ? numDollar : DEFAULT_DOLLAR_RATE;
    const payload = { dollarRate: finalDollar };
    MATERIALS.forEach((name) => {
      const v = rates[name];
      const n = Number(v);
      if (!Number.isNaN(n) && n >= 0) payload[name] = n;
    });
    setSaving(true);
    try {
      const res = await fetch("/api/v1/box-material-rates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      if (!res.ok) {
        throw new Error(text || `HTTP ${res.status}`);
      }
      setFetchError(null);
      Swal.fire({ icon: "success", title: "Rates updated" });
    } catch (e) {
      const msg = e?.message || "Failed to update rates";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-1/3 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Box material rates</h1>
      <p className="text-gray-600 mb-6">
        Unit price = (Length × Width × Depth × material rate) ÷ dollar rate. Prices shown in $.
      </p>
      {fetchError && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm">
          {fetchError} — using defaults. You can still save to update the server.
        </div>
      )}
      <div className="space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
          <Label className="w-32 font-medium">Dollar rate</Label>
          <TextInput
            type="number"
            min={0.01}
            step={1}
            value={dollarRate === "" ? "" : dollarRate}
            onChange={handleDollarRateChange}
            className="max-w-[200px]"
          />
          <span className="text-gray-500 text-sm">current rate (e.g. 280)</span>
        </div>
        {MATERIALS.map((name) => (
          <div key={name} className="flex items-center gap-4">
            <Label className="w-32 font-medium">{name}</Label>
            <TextInput
              type="number"
              min={0}
              step={1}
              value={rates[name] ?? ""}
              onChange={(e) => handleChange(name, e.target.value)}
              className="max-w-[200px]"
            />
            <span className="text-gray-500 text-sm">per L×W×H unit</span>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Button
          type="button"
          color="blue"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save rates"}
        </Button>
      </div>
    </div>
  );
}
