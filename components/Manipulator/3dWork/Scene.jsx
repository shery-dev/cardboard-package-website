"use client";

import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, CameraControls, useProgress, Html } from '@react-three/drei'
import { Suspense, useEffect, useRef, useState } from 'react'
import { MailerBox } from './Boxes/MailerBox'
import { PizzaBox } from './Boxes/PizzaBox'
import { ShippingBox } from './Boxes/ShippingBox'
import { KraftPaperBag } from './Boxes/KraftPaperBag'
import { PizzaSliceBox } from './Boxes/PizzaSliceBox'
import { CakeBox } from './Boxes/CakeBox'
import { DynamicBoxModel } from './Boxes/DynamicBoxModel'
import { useAppContext } from '@/context/Context';
import ToggleButton from '../assets/ToggleButton';
import WebGLErrorBoundary from '../assets/WebGLErrorBoundary';



const Scene = () => {

    const { isOpen, setIsOpen, selectedSide, box, activeItem, setActiveItem } = useAppContext()
    const cameraControlRef = useRef();
    const [canvasKey, setCanvasKey] = useState(0);

    const setCameraView = (view) => {
        const ctrl = cameraControlRef.current;
        if (!ctrl) return;
        if (view === 'iso') {
            ctrl.setLookAt(9, 7, 10, 0, -1, 0, true);
        } else if (view === 'front') {
            ctrl.setLookAt(0, 0, 14, 0, -1, 0, true);
        } else if (view === 'top') {
            ctrl.setLookAt(0, 14, 0, 0, -1, 0, true);
        } else if (view === 'side') {
            ctrl.setLookAt(14, 0, 0, 0, -1, 0, true);
        }
    };

    function Loader() {
        return (
            <Html center>
                <div className="flex flex-col items-center justify-center gap-2 p-3 bg-white/90 rounded-xl shadow-lg border border-[#DCCFC2]">
                    <div className="w-8 h-8 border-3 border-[#DCCFC2] border-t-[#A94F32] rounded-full animate-spin" />
                    <span className="text-[11px] font-bold text-[#2B211B]">Loading 3D Model...</span>
                </div>
            </Html>
        );
    }

    useEffect(() => {
        const cameraControls = cameraControlRef.current;
        if (!cameraControls || !selectedSide) return;

        const side = String(selectedSide).toLowerCase();

        // Smooth camera navigation to focus directly on the clicked side of the box
        if (side.includes('front') || side === 'topfront' || side === 'bottomfront' || side === 'lidfront') {
            cameraControls.setLookAt(0, -1, 13, 0, -1, 0, true);
        } else if (side.includes('back') || side === 'topback' || side === 'backwall') {
            cameraControls.setLookAt(0, -1, -13, 0, -1, 0, true);
        } else if (side === 'top' || side.includes('lid') || side === 'cover') {
            cameraControls.setLookAt(0, 13, 2.5, 0, -1, 0, true);
        } else if (side === 'bottom' || side === 'base' || side === 'tray') {
            cameraControls.setLookAt(0, -9, 3.5, 0, -2, 0, true);
        } else if (side.includes('left')) {
            cameraControls.setLookAt(-13, -1, 0, 0, -1, 0, true);
        } else if (side.includes('right')) {
            cameraControls.setLookAt(13, -1, 0, 0, -1, 0, true);
        }
    }, [selectedSide]);

    return (
        <div className="relative w-full h-full min-h-[500px] flex flex-col rounded-xl overflow-hidden border border-[#DCCFC2] bg-gradient-to-b from-[#FAF7F2] via-[#F4EFEA] to-[#EAE3D9] shadow-xs">
            {/* Top Viewport Floating Bar: Camera View Presets */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg border border-[#DCCFC2] shadow-xs text-xs font-semibold text-[#2B211B]">
                <span className="text-[10px] uppercase tracking-wider text-[#6B584D] px-1 font-bold">View:</span>
                <button
                    type="button"
                    onClick={() => setCameraView('iso')}
                    className="px-2 py-1 rounded hover:bg-[#F7F3ED] transition-colors text-[11px]"
                    title="Isometric 3D View"
                >
                    3D
                </button>
                <button
                    type="button"
                    onClick={() => setCameraView('front')}
                    className="px-2 py-1 rounded hover:bg-[#F7F3ED] transition-colors text-[11px]"
                    title="Front View"
                >
                    Front
                </button>
                <button
                    type="button"
                    onClick={() => setCameraView('top')}
                    className="px-2 py-1 rounded hover:bg-[#F7F3ED] transition-colors text-[11px]"
                    title="Top View"
                >
                    Top
                </button>
                <button
                    type="button"
                    onClick={() => setCameraView('side')}
                    className="px-2 py-1 rounded hover:bg-[#F7F3ED] transition-colors text-[11px]"
                    title="Side View"
                >
                    Side
                </button>
            </div>

            {/* 3D Canvas Container */}
            <div className="w-full flex-1 min-h-0 relative">
                <WebGLErrorBoundary onReset={() => setCanvasKey((k) => k + 1)}>
                    <Canvas
                        key={canvasKey}
                        eventPrefix="client"
                        camera={{ position: [0, -3, 10], fov: 75 }}
                        gl={{
                            powerPreference: 'default',
                            failIfMajorPerformanceCaveat: false,
                            antialias: true,
                            alpha: true,
                        }}
                        onCreated={({ gl }) => {
                            const handleContextLost = (e) => {
                                e.preventDefault();
                                console.warn('WebGL context lost. Ready to restore.');
                            };
                            gl.domElement.addEventListener('webglcontextlost', handleContextLost, false);
                        }}
                    >
                        <Suspense fallback={<Loader />}>
                            <CameraControls ref={cameraControlRef} />
                            <ambientLight intensity={0.7} />
                            <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 150, -15]} castShadow />
                            <Environment preset="city" blur={1} />
                            <ContactShadows resolution={512} position={[0, -1.8, 0]} opacity={1} scale={10} blur={2} far={0.8} />
                            <group position={[0, 0, 0]}>
                                {box === "pizzaBox" ? (
                                    <PizzaBox />
                                ) : box === "pizzaSliceBox" ? (
                                    <PizzaSliceBox />
                                ) : box === "cakeBox" ? (
                                    <CakeBox />
                                ) : box === "shippingBox" ? (
                                    <ShippingBox />
                                ) : box === "kraftPaperBag" ? (
                                    <KraftPaperBag />
                                ) : box === "toolBox" ? (
                                    <DynamicBoxModel glbPath="/ToolBox.glb" baseDimensions={{ len: 16, wid: 10, dep: 8 }} lidGroupName="ToolBoxLidGroup" />
                                ) : box === "giftBox" ? (
                                    <DynamicBoxModel glbPath="/GiftBox.glb" baseDimensions={{ len: 8, wid: 8, dep: 4 }} isTelescoping={true} liftAmount={2.3} closedY={0.52} lidGroupName="GiftBoxLidGroup" />
                                ) : box === "ecommerceBox" ? (
                                    <DynamicBoxModel glbPath="/EcommerceBox.glb" baseDimensions={{ len: 11, wid: 8, dep: 4 }} lidGroupName="EcommerceLidGroup" />
                                ) : box === "laptopBox" ? (
                                    <DynamicBoxModel glbPath="/LaptopBox.glb" baseDimensions={{ len: 16, wid: 12, dep: 3 }} lidGroupName="LaptopLidGroup" />
                                ) : box === "flatFolderBox" ? (
                                    <DynamicBoxModel glbPath="/FlatFolderBox.glb" baseDimensions={{ len: 12, wid: 12, dep: 2 }} lidGroupName="FlatLidGroup" />
                                ) : box === "foodComboBox" ? (
                                    <DynamicBoxModel glbPath="/FoodComboBox.glb" baseDimensions={{ len: 10, wid: 8, dep: 4 }} lidGroupName="FoodLidGroup" />
                                ) : box === "foodPackagingBox" ? (
                                    <DynamicBoxModel glbPath="/FoodPackagingBox.glb" baseDimensions={{ len: 9, wid: 6, dep: 4 }} lidGroupName="PlatterLidGroup" />
                                ) : box === "apparelBox" ? (
                                    <DynamicBoxModel glbPath="/ApparelBox.glb" baseDimensions={{ len: 14, wid: 10, dep: 3 }} isTelescoping={true} liftAmount={1.8} closedY={0.37} lidGroupName="ApparelLidGroup" />
                                ) : box === "rationBox" ? (
                                    <DynamicBoxModel glbPath="/RationBox.glb" baseDimensions={{ len: 18, wid: 12, dep: 12 }} lidGroupName="RationLidGroup" />
                                ) : box === "cubeBox" ? (
                                    <DynamicBoxModel glbPath="/CubeBox.glb" baseDimensions={{ len: 10, wid: 10, dep: 10 }} lidGroupName="CubeLidGroup" />
                                ) : box === "corporateBox" ? (
                                    <DynamicBoxModel glbPath="/CorporateBox.glb" baseDimensions={{ len: 12, wid: 10, dep: 4 }} lidGroupName="CorporateLidGroup" />
                                ) : (
                                    <MailerBox />
                                )}
                            </group>
                        </Suspense>
                    </Canvas>
                </WebGLErrorBoundary>
            </div>

            {/* Bottom Floating Packlane HUD: Lid State & 2D/3D Switcher */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-[#DCCFC2] shadow-md">
                {/* Packlane-Style Lid State Pill */}
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#6B584D] uppercase tracking-wider">Lid:</span>
                    <button
                        type="button"
                        onClick={() => setIsOpen((prev) => !prev)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            isOpen
                                ? "bg-[#A94F32] text-white shadow-xs"
                                : "bg-[#2B211B] text-[#FFFDFC] shadow-xs"
                        }`}
                    >
                        <span>{isOpen ? "Open" : "Closed"}</span>
                    </button>
                </div>

                <div className="w-[1px] h-5 bg-[#DCCFC2]" />

                {/* Switch to 2D Net / 3D Box Toggle */}
                <button
                    type="button"
                    onClick={() => setActiveItem(activeItem === 'design' ? 'boxtype' : 'design')}
                    className="text-xs font-bold text-[#2B211B] hover:text-[#A94F32] transition-colors flex items-center gap-1.5"
                >
                    <span>{activeItem === 'design' ? "Close 2D Net" : "Edit 2D Net"}</span>
                </button>
            </div>

            {/* Bottom Left Subtle Interaction Guide */}
            <div className="absolute bottom-3 left-3 z-10 pointer-events-none hidden sm:block">
                <span className="text-[10px] text-[#6B584D] font-medium bg-white/70 backdrop-blur-xs px-2 py-1 rounded-md border border-[#DCCFC2]/60">
                    Drag to rotate • Scroll to zoom
                </span>
            </div>
        </div>
    );
};

export default Scene;