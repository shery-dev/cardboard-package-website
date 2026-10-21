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
    const { material, quantity, selectedSize, setItemsList, viewType,
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
        <div className="w-full flex-1 min-h-0 flex flex-col max-w-sm mx-auto bg-white shadow-md rounded-md p-4 overflow-hidden min-w-0 h-full min-h-[calc(100%+180px)]">
            <div className="flex-1 min-h-0 overflow-auto">
                <div className="mb-2 pb-2 border-b border-green-50">
                    <div className="rounded-md bg-teal-500/90 px-3 py-1.5 mb-1.5">
                        <span className="text-white font-semibold text-base">{currentMaterial}</span>
                    </div>
                    <p className="text-gray-600 text-sm rounded bg-gray-100 px-3 py-1.5">
                        {materialDesc}
                    </p>
                </div>
                <div className="mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        {activeBoxPreset?.badge || "Custom Packaging"}
                    </span>
                    <h2 className="text-lg font-bold text-headingTxtColor leading-tight mt-0.5">
                        {activeBoxPreset?.name || data?.cardboardname || 'Standard Mailer Box'}
                    </h2>
                    <p className="text-gray-500 text-xs mt-0.5 font-medium">
                        {activeBoxPreset?.category || 'Custom Box'}
                    </p>
                    {activeBoxPreset?.description && (
                        <p className="text-gray-600 mt-1 pb-1 text-xs text-justify border-b border-green-50 line-clamp-2">
                            {activeBoxPreset.description}
                        </p>
                    )}
                </div>
                <div className="flex-1 flex flex-col justify-between min-h-[200px] w-full min-w-0 py-2">
                    <div className="flex justify-between items-center gap-2 py-2 border-b border-gray-100 w-full">
                        <span className="font-semibold text-gray-800 text-sm shrink-0">Size</span>
                        <span className="text-gray-700 text-sm text-right truncate min-w-0">{selectedSize ? `${selectedSize.length} × ${selectedSize.width} × ${selectedSize.depth}` : "—"}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2 py-2 border-b border-gray-100 w-full">
                        <span className="font-semibold text-gray-800 text-sm shrink-0">Material</span>
                        <span className="text-gray-700 text-sm text-right truncate min-w-0">{material || "Kraft"}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2 py-2 border-b border-gray-100 w-full">
                        <span className="font-semibold text-gray-800 text-sm shrink-0">Quantity</span>
                        <span className="text-gray-700 text-sm text-right">{quantity != null ? String(quantity) : "—"}</span>
                    </div>
                    {!quantityValid && <p className="text-amber-600 text-xs py-1">Please add 500 or more quantity (from the left panel).</p>}
                    <div className="flex justify-between items-center gap-2 py-2 border-b border-gray-100 w-full">
                        <span className="font-semibold text-gray-800 text-sm shrink-0">Unit price</span>
                        <span className="text-gray-700 font-medium text-sm text-right">$ {Number(unitPrice).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2 py-2 border-b border-gray-100 w-full">
                        <span className="font-semibold text-gray-800 text-sm shrink-0">Subtotal</span>
                        <span className="text-headingTxtColor font-semibold text-sm text-right">$ {Number(subtotal).toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <div className="pt-2 shrink-0 border-t border-gray-100 relative z-10">
                <button
                    type="button"
                    className="w-full bg-headingTxtColor text-white py-2 text-sm rounded-md hover:bg-headingHover disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(); }}
                    disabled={!quantityValid || subtotal <= 0 || addingToCart}
                >
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button
                    type="button"
                    className="w-full bg-headingTxtColor text-white py-2 text-sm mt-2 rounded-md hover:bg-headingHover disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSaveDesign(); }}
                >
                    Save Design
                </button>
            </div>
        </div>
    );
};

export default ProductForm;
