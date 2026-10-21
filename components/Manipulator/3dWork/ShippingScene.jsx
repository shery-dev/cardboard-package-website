"use client";

import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls, CameraControls, useProgress, Html } from '@react-three/drei'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useSpring, a } from '@react-spring/three';
import { ShippingBox } from './Boxes/ShippingBox'
import { useAppContext } from '@/context/Context';
import ToggleButton from '../assets/ToggleButton';
import WebGLErrorBoundary from '../assets/WebGLErrorBoundary';



const ShippingScene = () => {

    const { isOpen, setIsOpen, selectedSide } = useAppContext()
    const cameraControlRef = useRef();
    const [canvasKey, setCanvasKey] = useState(0);

    const [spring, setSpring] = useSpring(() => ({ rotation: [0, 0, 0] }))

    function Loader() {
        const { progress } = useProgress()
        return (
            <Html center>
                <svg role="img" aria-label="Mouth and eyes come from 9:00 and rotate clockwise into position, right eye blinks, then all parts rotate and merge into 3:00" class="smiley" viewBox="0 0 128 128" width="128px" height="128px">
                    <defs>
                        <clipPath id="smiley-eyes">
                            <circle class="smiley__eye1" cx="64" cy="64" r="8" transform="rotate(-40,64,64) translate(0,-56)" />
                            <circle class="smiley__eye2" cx="64" cy="64" r="8" transform="rotate(40,64,64) translate(0,-56)" />
                        </clipPath>
                        <linearGradient id="smiley-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#000" />
                            <stop offset="100%" stop-color="#fff" />
                        </linearGradient>
                        <mask id="smiley-mask">
                            <rect x="0" y="0" width="128" height="128" fill="url(#smiley-grad)" />
                        </mask>
                    </defs>
                    <g stroke-linecap="round" stroke-width="12" stroke-dasharray="175.93 351.86">
                        <g>
                            <rect fill="hsl(193,90%,50%)" width="128" height="64" clip-path="url(#smiley-eyes)" />
                            <g fill="none" stroke="hsl(193,90%,50%)">
                                <circle class="smiley__mouth1" cx="64" cy="64" r="56" transform="rotate(180,64,64)" />
                                <circle class="smiley__mouth2" cx="64" cy="64" r="56" transform="rotate(0,64,64)" />
                            </g>
                        </g>
                        <g mask="url(#smiley-mask)">
                            <rect fill="hsl(223,90%,50%)" width="128" height="64" clip-path="url(#smiley-eyes)" />
                            <g fill="none" stroke="hsl(223,90%,50%)">
                                <circle class="smiley__mouth1" cx="64" cy="64" r="56" transform="rotate(180,64,64)" />
                                <circle class="smiley__mouth2" cx="64" cy="64" r="56" transform="rotate(0,64,64)" />
                            </g>
                        </g>
                    </g>
                </svg>
            </Html>

        )
    }

    useEffect(() => {
        const cameraControls = cameraControlRef.current;

        if (!cameraControls) return;


        if (selectedSide === 'right') {
            cameraControls.rotateTo(0, Math.PI / 2);
            cameraControls.rotateTo(Math.PI / 2, Math.PI / 2);
        } else if (selectedSide === 'left') {
            cameraControls.rotateTo(0, Math.PI / 2);
            cameraControls.rotateTo(-Math.PI / 2, Math.PI / 2);
        } else if (selectedSide === 'front') {
            cameraControls.rotateTo(0, Math.PI / 2);
        } else if (selectedSide === 'back') {
            cameraControls.rotateTo(0, Math.PI / 2);
            cameraControls.rotateTo(Math.PI, Math.PI / 2);
        } else if (selectedSide === 'bottom') {
            cameraControls.rotateTo(Math.PI * 2, Math.PI / 2);
            setIsOpen(false);
            setSpring({ rotation: [-Math.PI / 2, 0, 0] });
        } else if (selectedSide === 'bottomLeft') {
            cameraControls.rotateTo(Math.PI * 2, Math.PI / 2);
            setIsOpen(true);
            setSpring({ rotation: [0, Math.PI / 2, 0] });
        }
        else if (selectedSide === 'bottomRight') {
            cameraControls.rotateTo(Math.PI * 2, Math.PI / 2);
            setIsOpen(true);
            setSpring({ rotation: [0, -Math.PI / 2, 0] });
        }
        else if (selectedSide === 'bottomFront') {
            cameraControls.rotateTo(Math.PI * 2, Math.PI / 2);
            setIsOpen(true);
            setSpring({ rotation: [0, Math.PI * 2, 0] });
        }
        else if (selectedSide === 'lidLeft') {
            cameraControls.rotateTo(Math.PI * 2, Math.PI / 2);
            setIsOpen(false);
            setSpring({ rotation: [0, Math.PI / 2, 0] });
        }
        else if (selectedSide === 'lidRight') {
            cameraControls.rotateTo(Math.PI * 2, Math.PI / 2);
            setIsOpen(false);
            setSpring({ rotation: [0, -Math.PI / 2, 0] });
        }

    }, [selectedSide, setSpring]);

    return (
        <>
            <div className=" w-100 mt-2" style={{ height: 90 + 'vh' }}>
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
                            gl.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault(), false);
                        }}
                    >
                        <Suspense fallback={<Loader />}>
                            <CameraControls ref={cameraControlRef} />
                            <ambientLight intensity={0.7} />
                            <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 150, -15]} castShadow />
                            <Environment preset="city" blur={1} />
                            <ContactShadows resolution={512} position={[0, -1.8, 0]} opacity={1} scale={10} blur={2} far={0.8} />
                            <a.group rotation={spring.rotation}>
                                <ShippingBox />
                            </a.group>
                            <OrbitControls />
                        </Suspense>
                    </Canvas>
                </WebGLErrorBoundary>
            </div>

            <div className=" flex justify-center items-center flex-row gap-4">
                <p className=" text-gray-600">Open</p>
                <ToggleButton
                    setState={setIsOpen}
                    isOpen={isOpen}
                />
                <p className=" text-gray-600">Closed</p>
            </div>

        </>
    );
};

export default ShippingScene;