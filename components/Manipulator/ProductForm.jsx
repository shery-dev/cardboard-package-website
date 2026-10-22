'use client';

import { useAppContext } from '@/context/Context';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const DEFAULT_RATES = { Kraft: 100, White: 200, Dreamcoat: 300 };
const DEFAULT_DOLLAR_RATE = 280;

async function getBoxMaterialRates() {
    try {
        const res = await fetch('/api/v1/box-material-rates');
        if (!res.ok) return { data: DEFAULT_RATES, dollarRate: DEFAULT_DOLLAR_RATE };
        const json = await res.json();
        return {
            data: json.data || DEFAULT_RATES,
            dollarRate: Number(json.dollarRate) || DEFAULT_DOLLAR_RATE,
        };
    } catch (error) {
        return { data: DEFAULT_RATES, dollarRate: DEFAULT_DOLLAR_RATE };
    }
}

const MIN_QUANTITY = 500;

const MATERIAL_DESCRIPTIONS = {
    White: "Classic white cardboard with a refined matte finish.",
    Dreamcoat: "Classic dreamcoat cardboard with a refined matte finish.",
    Kraft: "Classic Kraft cardboard with a refined matte finish.",
};

const CATEGORY_PATH = 'Food and Restaurant > Standard Mailer Box';
const CUSTOM_BOX_CART_IMAGE = '/products/Food.png';

const ProductForm = ({ data }) => {
    const router = useRouter();
    const { material, quantity, setQuantity, selectedSize, setItemsList, viewType,
        imagePositions, imageSizes, imageRotations, images, extTexImg, sideColors, extTexImgBlob,
        activeBoxPreset
    } = useAppContext();
    const [rates, setRates] = useState(DEFAULT_RATES);
    const [dollarRate, setDollarRate] = useState(DEFAULT_DOLLAR_RATE);
    const [unitPrice, setUnitPrice] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        getBoxMaterialRates().then(({ data, dollarRate: dr }) => {
            setRates(data || DEFAULT_RATES);
            setDollarRate(dr || DEFAULT_DOLLAR_RATE);
        });
    }, []);

    // Unit price = (Length × Width × Depth × material rate) / dollar rate
    useEffect(() => {
        if (!selectedSize || !material) {
            setUnitPrice(0);
            setSubtotal(0);
            return;
        }
        const L = Number(selectedSize.length) || 0;
        const W = Number(selectedSize.width) || 0;
        const D = Number(selectedSize.depth) || 0;
        const rate = Number(rates[material]) ?? DEFAULT_RATES[material] ?? 100;
        const div = Number(dollarRate) || DEFAULT_DOLLAR_RATE;
        const up = div > 0 ? (L * W * D * rate) / div : 0;
        setUnitPrice(up);
        const q = Number(quantity) || 0;
        setSubtotal(up * q);
    }, [quantity, material, selectedSize, rates, dollarRate]);

    const quantityValid = Number(quantity) >= MIN_QUANTITY;

    const buildDesignViewUrl = () => {
        const L = selectedSize?.length ?? 10;
        const W = selectedSize?.width ?? 10;
        const H = selectedSize?.depth ?? 10;
        const mat = material || 'Kraft';
        const presetId = activeBoxPreset?.id || 'mailerBox';
        return `/customTool?type=main&preset=${encodeURIComponent(presetId)}&length=${L}&width=${W}&depth=${H}&material=${encodeURIComponent(mat)}`;
    };

    const blobUrlToDataUrl = async (url) => {
        if (!url || typeof url !== 'string') return null;
        try {
            const res = await fetch(url);
            const blob = await res.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (e) {
            return null;
        }
    };

    const handleAddToCart = async () => {
        if (!quantityValid || subtotal <= 0) return;
        setAddingToCart(true);
        try {
            const L = Number(selectedSize?.length) ?? 0;
            const W = Number(selectedSize?.width) ?? 0;
            const D = Number(selectedSize?.depth) ?? 0;
            let imgSrc = CUSTOM_BOX_CART_IMAGE;
            if (extTexImgBlob) {
                const dataUrl = await blobUrlToDataUrl(extTexImgBlob);
                if (dataUrl) imgSrc = dataUrl;
            }
            const item = {
                id: data?._id ? `${data._id}-${Date.now()}` : `custom-${Date.now()}`,
                ThreeD: true,
                name: activeBoxPreset?.name || (viewType === 'main' ? 'Standard Mailer Box' : (data?.cardboardname || 'Custom Box')),
                categoryPath: activeBoxPreset?.category || CATEGORY_PATH,
                img: imgSrc,
                quantity: Number(quantity),
                pricePerPiece: unitPrice,
                price: subtotal,
                dimension: {
                    length: L,
                    width: W,
                    depth: D,
                },
                printedSides: 4,
                material: material || 'Kraft',
                thickness: 3,
                pieceLabel: '2 ply',
                designViewUrl: buildDesignViewUrl(),
            };
            setItemsList((prev) => [...prev, item]);
            router.push('/shopping-cart');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleSaveDesign = async () => {
        const designName = data?.cardboardname || 'Standard Mailer Box';
        const designData = {
            colour: sideColors || {},
            images: images || {},
            imageRotation: imageRotations || {},
            imagesizes: imageSizes,
            imagePosition: imagePositions || {},
            materail: extTexImg || 'MailerBoxOuterTex-Kraft.png',
        };

        try {
            const res = await fetch(`/api/v1/featureProduct/${encodeURIComponent(designName)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(designData),
            });

            if (!res.ok) throw new Error('Failed to save design');

            const json = await res.json().catch(() => ({}));
            const designId = json.id;
            const loadLink = designId ? `${typeof window !== 'undefined' ? window.location.origin : ''}/customTool?type=main&designId=${designId}` : buildDesignViewUrl();
            if (typeof window !== 'undefined') {
                window.alert(designId ? `Design saved. Load it anytime from Admin > Saved Designs, or open: ${loadLink}` : 'Design saved.');
            }
        } catch (error) {
            console.error('Save design failed:', error);
            if (typeof window !== 'undefined') {
                window.alert('Failed to save design. Please try again.');
            }
        }
    };

    const currentMaterial = material || "Kraft";
    const materialDesc = MATERIAL_DESCRIPTIONS[currentMaterial] ?? MATERIAL_DESCRIPTIONS.Kraft;

    return (
        <div className="w-full h-full flex flex-col bg-white rounded-xl border border-[#DCCFC2] shadow-xs p-4 overflow-hidden">
            {/* Header / Active Box Info */}
            <div className="pb-3 border-b border-[#DCCFC2]">
                <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A94F32] bg-[#A94F32]/10 px-2 py-0.5 rounded">
                        {activeBoxPreset?.badge || "Custom Packaging"}
                    </span>
                    <span className="text-[11px] font-semibold text-[#6B584D]">
                        {currentMaterial}
                    </span>
                </div>
                <h2 className="text-base font-bold text-[#2B211B] leading-tight">
                    {activeBoxPreset?.name || data?.cardboardname || 'Standard Mailer Box'}
                </h2>
                <p className="text-[11px] text-[#6B584D] mt-0.5">
                    {activeBoxPreset?.category || 'Custom Box'}
                </p>
            </div>

            {/* Scrollable Summary Body */}
            <div className="flex-1 min-h-0 overflow-y-auto py-3 flex flex-col gap-3">
                {/* Real-time Price Hero */}
                <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#DCCFC2]">
                    <div className="flex items-baseline justify-between">
                        <div>
                            <span className="text-2xl font-bold text-[#2B211B]">
                                ${Number(unitPrice).toFixed(2)}
                            </span>
                            <span className="text-xs text-[#6B584D] ml-1">/ unit</span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-[#6B584D] block">Subtotal</span>
                            <span className="text-lg font-bold text-[#A94F32]">
                                ${Number(subtotal).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Volume Tiers Quick Selector (Packlane style) */}
                <div>
                    <label className="text-[11px] font-bold text-[#2B211B] uppercase tracking-wider block mb-1.5">
                        Select Quantity
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                        {[500, 1000, 2500, 5000].map((qty) => {
                            const isSelected = Number(quantity) === qty;
                            return (
                                <button
                                    key={qty}
                                    type="button"
                                    onClick={() => setQuantity && setQuantity(qty)}
                                    className={`py-1.5 px-1 rounded-md text-center transition-all border ${
                                        isSelected
                                            ? "bg-[#2B211B] text-[#FFFDFC] border-[#2B211B] shadow-xs font-bold"
                                            : "bg-[#FAF7F2] text-[#2B211B] border-[#DCCFC2] hover:border-[#2B211B] text-xs font-semibold"
                                    }`}
                                >
                                    <span className="block text-xs">{qty}</span>
                                </button>
                            );
                        })}
                    </div>
                    {!quantityValid && (
                        <p className="text-amber-700 text-[11px] mt-1 font-medium">
                            Minimum order quantity is 500 units.
                        </p>
                    )}
                </div>

                {/* Specifications List */}
                <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#DCCFC2]/60">
                        <span className="text-[#6B584D] font-medium">Dimensions (L×W×D)</span>
                        <span className="font-semibold text-[#2B211B]">
                            {selectedSize ? `${selectedSize.length}″ × ${selectedSize.width}″ × ${selectedSize.depth}″` : "—"}
                        </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#DCCFC2]/60">
                        <span className="text-[#6B584D] font-medium">Material Finish</span>
                        <span className="font-semibold text-[#2B211B]">{material || "Kraft"}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#DCCFC2]/60">
                        <span className="text-[#6B584D] font-medium">Production Time</span>
                        <span className="font-semibold text-[#2B211B]">5–7 business days</span>
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#DCCFC2] flex flex-col gap-2 shrink-0">
                <button
                    type="button"
                    className="w-full bg-[#2B211B] hover:bg-[#A94F32] text-[#FFFDFC] py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(); }}
                    disabled={!quantityValid || subtotal <= 0 || addingToCart}
                >
                    {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                </button>
                <button
                    type="button"
                    className="w-full bg-white hover:bg-[#FAF7F2] text-[#2B211B] border border-[#DCCFC2] py-2 px-4 text-xs font-bold rounded-lg transition-colors"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSaveDesign(); }}
                >
                    Save Design
                </button>
            </div>
        </div>
    );
};

export default ProductForm;
