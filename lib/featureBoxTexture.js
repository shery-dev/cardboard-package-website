/**
 * Generates a feature box texture: solid brand color on all sides with logo
 * or branded vector badge centered on front, back, and top panels.
 * Supports all 17 box types and their tailored brands (Layers, Domino's, Dell, etc.)
 */

import { BOX_PRESETS } from './boxPresets';

const VIEWBOX_SIZE = 245.76;
const TEX_SIZE = 2048;
const SCALE = TEX_SIZE / VIEWBOX_SIZE;

const FRONT_BACK_TOP_BOUNDS = [
  { name: 'top', x: 98.81, y: 52.44, width: 48.1, height: 44.54, rotate180: false },
  { name: 'back', x: 98.81, y: 101.66, width: 48.1, height: 43.73, rotate180: false },
  { name: 'front', x: 98.81, y: 196.24, width: 48.1, height: 45.56, rotate180: true },
];

const LOGO_PADDING = 4;

// Build a fast lookup map for all brand configurations across all presets
const ALL_BRANDS_MAP = {};
BOX_PRESETS.forEach((preset) => {
  preset.featuredBrands.forEach((b) => {
    ALL_BRANDS_MAP[b.key] = b;
    ALL_BRANDS_MAP[b.label] = b;
  });
});

export const FEATURE_BRAND_COLORS = {
  DHL: '#D40511',
  FedEx: '#4D148C',
  TCS: '#FFFFFF',
  UPS: '#351C15',
  LEOPARDS: '#FFD700',
};

function drawLogoInRect(ctx, img, x, y, w, h, rotate180 = false) {
  const pad = LOGO_PADDING * SCALE;
  const rw = w - pad * 2;
  const rh = h - pad * 2;
  if (rw <= 0 || rh <= 0) return;
  const imgAspect = img.width / img.height;
  const rectAspect = rw / rh;
  let drawW = rw;
  let drawH = rh;
  if (imgAspect > rectAspect) {
    drawH = rw / imgAspect;
  } else {
    drawW = rh * imgAspect;
  }
  const dx = x + (rw - drawW) / 2 + pad;
  const dy = y + (rh - drawH) / 2 + pad;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  if (rotate180) {
    const cx = x + w / 2;
    const cy = y + h / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.PI);
    ctx.translate(-cx, -cy);
    ctx.drawImage(img, dx, dy, drawW, drawH);
    ctx.restore();
  } else {
    ctx.drawImage(img, dx, dy, drawW, drawH);
  }
}

function drawBrandBadge(ctx, brand, x, y, w, h, rotate180 = false) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  ctx.save();
  if (rotate180) {
    ctx.translate(cx, cy);
    ctx.rotate(Math.PI);
    ctx.translate(-cx, -cy);
  }

  const badgeW = Math.min(w * 0.85, 360);
  const badgeH = Math.min(h * 0.45, 140);
  const bx = cx - badgeW / 2;
  const by = cy - badgeH / 2;

  // Outer badge card
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = brand.accentColor || '#C7A882';
  ctx.lineWidth = 6;
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(bx, by, badgeW, badgeH, 14);
  } else {
    ctx.rect(bx, by, badgeW, badgeH);
  }
  ctx.fill();
  ctx.stroke();

  // Subtle inner border
  ctx.strokeStyle = 'rgba(0,0,0,0.06)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Brand Name
  ctx.fillStyle = brand.color || '#111827';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const fontSize = brand.label && brand.label.length > 14 ? 26 : 32;
  ctx.font = `bold ${fontSize}px "Segoe UI", "Inter", Arial, sans-serif`;
  ctx.fillText(brand.label.toUpperCase(), cx, cy - 12);

  // Tagline
  if (brand.tagline) {
    ctx.fillStyle = '#6B7280';
    ctx.font = '600 13px "Segoe UI", "Inter", Arial, sans-serif';
    ctx.fillText(brand.tagline.toUpperCase(), cx, cy + 20);
  }

  ctx.restore();
}

/**
 * @param {string|object} brand - brand key or brand object
 * @param {string} [customLogoUrl] - optional custom logo image URL
 * @returns {Promise<string>} - Blob URL of the generated PNG texture
 */
export function createFeatureBoxTexture(brand, customLogoUrl) {
  let brandObj = null;
  if (typeof brand === 'object' && brand !== null) {
    brandObj = brand;
  } else if (typeof brand === 'string') {
    brandObj = ALL_BRANDS_MAP[brand] || {
      key: brand,
      label: brand,
      color: FEATURE_BRAND_COLORS[brand] || '#888888',
      accentColor: '#FFFFFF',
      textColor: '#FFFFFF',
    };
  }

  const fillColor = brandObj?.color || FEATURE_BRAND_COLORS[brand] || '#888888';
  const logoImageUrl = customLogoUrl || brandObj?.logoUrl;

  return new Promise((resolve, reject) => {
    const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
    if (!canvas) {
      reject(new Error('Canvas not available'));
      return;
    }
    canvas.width = TEX_SIZE;
    canvas.height = TEX_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('2d context not available'));
      return;
    }

    // Base background color fill
    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, TEX_SIZE, TEX_SIZE);

    // If a logo image URL is provided, try loading and drawing it
    if (logoImageUrl) {
      const img = new Image();
      if (typeof logoImageUrl === 'string' && (logoImageUrl.startsWith('http://') || logoImageUrl.startsWith('https://'))) {
        img.crossOrigin = 'anonymous';
      }
      img.onload = () => {
        try {
          for (const rect of FRONT_BACK_TOP_BOUNDS) {
            const x = rect.x * SCALE;
            const y = rect.y * SCALE;
            const w = rect.width * SCALE;
            const h = rect.height * SCALE;
            drawLogoInRect(ctx, img, x, y, w, h, rect.rotate180 === true);
          }
          const dataUrl = canvas.toDataURL('image/png');
          const blob = dataUrlToBlob(dataUrl);
          const url = URL.createObjectURL(blob);
          resolve(url);
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = () => {
        // Fallback to high-quality vector badge if image fails to load
        renderBadgesAndResolve();
      };
      img.src = logoImageUrl;
      return;
    }

    // No logo URL -> render crisp vector badge
    renderBadgesAndResolve();

    function renderBadgesAndResolve() {
      try {
        if (brandObj) {
          for (const rect of FRONT_BACK_TOP_BOUNDS) {
            const x = rect.x * SCALE;
            const y = rect.y * SCALE;
            const w = rect.width * SCALE;
            const h = rect.height * SCALE;
            drawBrandBadge(ctx, brandObj, x, y, w, h, rect.rotate180 === true);
          }
        }
        const dataUrl = canvas.toDataURL('image/png');
        const blob = dataUrlToBlob(dataUrl);
        const url = URL.createObjectURL(blob);
        resolve(url);
      } catch (e) {
        reject(e);
      }
    }
  });
}

function dataUrlToBlob(dataUrl) {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)[1];
  const bstr = atob(parts[1]);
  const n = bstr.length;
  const u8 = new Uint8Array(n);
  for (let i = 0; i < n; i++) u8[i] = bstr.charCodeAt(i);
  return new Blob([u8], { type: mime });
}
