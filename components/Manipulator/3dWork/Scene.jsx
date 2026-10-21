"use client";

import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls, CameraControls, useProgress, Html } from '@react-three/drei'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useSpring, a } from '@react-spring/three';
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

    const { isOpen, setIsOpen, selectedSide, box } = useAppContext()
    const cameraControlRef = useRef();
    const [canvasKey, setCanvasKey] = useState(0);

    const [spring, setSpring] = useSpring(() => ({ rotation: [0, 0, 0] }))

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

        if (!cameraControls) return;


        if (selectedSide === 'topFront') {
            cameraControls.rotateTo(Math.PI * 2, Math.PI / 2);
            setIsOpen(false);
            setSpring({ rotation: [0, 0, 0] });
        } else if (selectedSide === 'top') {
            cameraControls.rotateTo(Math.PI * 2, Math.PI / 2);
            setIsOpen(false);
            setSpring({ rotation: [Math.PI / 2, 0, 0] });
        } else if (selectedSide === 'topBack') {
            cameraControls.rotateTo(Math.PI * 2, Math.PI / 2);
            setIsOpen(false);
            setSpring({ rotation: [0, Math.PI, 0] });
        } else if (selectedSide === 'bottomFront') {
            cameraControls.rotateTo(Math.PI * 2, Math.PI / 2);
            setIsOpen(true);
            setSpring({ rotation: [0, 0, 0] });
        } else if (selectedSide === 'bottom') {
            cameraControls.rotateTo(Math.PI * 2, Math.PI / 2);
            setIsOpen(false);
            setSpring({ rotation: [-Math.PI / 2, 0, 0] });
        } else if (selectedSide === 'bottomRight') {
            cameraControls.rotateTo(Math.PI * 2, Math.PI / 2);
            setIsOpen(false);
            setSpring({ rotation: [0, Math.PI / 2, 0] });
        }
        else if (selectedSide === 'bottomLeft') {
            cameraControls.rotateTo(Math.PI * 2, Math.PI / 2);
            setIsOpen(false);
            setSpring({ rotation: [0, -Math.PI / 2, 0] });
        }

    }, [selectedSide, setSpring]);

    return (
        <>
            <div className="w-full mt-2 shrink-0" style={{ height: '65vh' }}>
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
                            <a.group rotation={spring.rotation}>
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
                            </a.group>
                            <OrbitControls />
                        </Suspense>
                    </Canvas>
                </WebGLErrorBoundary>
            </div>

            <div className="flex justify-center items-center flex-row gap-4 mt-[80px] mb-2 shrink-0">
                <p className="text-gray-600">Open</p>
                <ToggleButton
                    setState={setIsOpen}
                    isOpen={isOpen}
                />
                <p className="text-gray-600">Closed</p>
            </div>

        </>
    );
};

export default Scene;