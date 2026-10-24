"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { useAppContext } from '@/context/Context';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createFeatureBoxTexture } from '@/lib/featureBoxTexture';

const DEFAULT_EXT_TEX = '/kraftTexture.jpg';

export function CakeBox(props) {
  const {
    isOpen,
    material,
    selectedSize,
    extTexImgBlob,
    activeItem,
    selectedFeatureProduct,
    extTexColor,
    sideColors,
  } = useAppContext();

  const group = useRef();
  const lidGroupRef = useRef();
  const generatedBlobRef = useRef(null);
  const [generatedFeatureTexUrl, setGeneratedFeatureTexUrl] = useState(null);
  const dimenstionsValue = selectedSize;

  /**
   * Bakery Cake Box Scaling:
   * - Length: Front width (e.g. 10″, 12″) -> scales X
   * - Width:  Side depth (e.g. 10″, 12″) -> scales Z
   * - Depth:  Height clearance (e.g. 2.5″, 5″, 10″) -> scales Y
   *
   * Grounded at baseline y = -4.00 flush with contact shadows.
   */
  const cakeDimensionMaker = () => {
    const len = Math.max(1, parseFloat(dimenstionsValue?.length) || 10);
    const wid = Math.max(1, parseFloat(dimenstionsValue?.width) || 10);
    const dep = Math.max(1, parseFloat(dimenstionsValue?.depth) || 5);

    const scaleX = len / 10;
    const scaleZ = wid / 10;
    const scaleY = dep / 5;

    return [scaleX, scaleY, scaleZ];
  };

  const isFeatureShowcase = activeItem === 'featureproduct' && selectedFeatureProduct;

  useEffect(() => {
    if (!isFeatureShowcase || !selectedFeatureProduct) {
      if (generatedBlobRef.current) {
        URL.revokeObjectURL(generatedBlobRef.current);
        generatedBlobRef.current = null;
      }
      setGeneratedFeatureTexUrl(null);
      return;
    }
    let cancelled = false;
    createFeatureBoxTexture(selectedFeatureProduct)
      .then((blobUrl) => {
        if (!cancelled) {
          if (generatedBlobRef.current) URL.revokeObjectURL(generatedBlobRef.current);
          generatedBlobRef.current = blobUrl;
          setGeneratedFeatureTexUrl(blobUrl);
        } else {
          URL.revokeObjectURL(blobUrl);
        }
      })
      .catch(() => {
        if (!cancelled) setGeneratedFeatureTexUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [isFeatureShowcase, selectedFeatureProduct]);

  useEffect(() => {
    return () => {
      if (generatedBlobRef.current) {
        URL.revokeObjectURL(generatedBlobRef.current);
        generatedBlobRef.current = null;
      }
    };
  }, []);

  const defaultExtTex = material === 'White'
    ? '/whiteCoatTexture.jpg'
    : material === 'Dreamcoat'
    ? '/dreamCoatTexture.jpg'
    : '/whiteCoatTexture.jpg';

  const extTexMapUrl = isFeatureShowcase
    ? (generatedFeatureTexUrl || defaultExtTex)
    : (extTexImgBlob || defaultExtTex);

  const extTex = useTexture({ map: extTexMapUrl });

  const { nodes } = useGLTF('/CakeBox.glb');

  // Smooth top lid open/close animation and dynamic scale lerping
  useFrame((state, delta) => {
    const [scaleX, scaleY, scaleZ] = cakeDimensionMaker();

    if (group.current) {
      group.current.scale.x = THREE.MathUtils.lerp(group.current.scale.x, scaleX, delta * 10);
      group.current.scale.y = THREE.MathUtils.lerp(group.current.scale.y, scaleY, delta * 10);
      group.current.scale.z = THREE.MathUtils.lerp(group.current.scale.z, scaleZ, delta * 10);
    }

    if (!lidGroupRef.current) return;
    const targetRotX = isOpen ? -Math.PI * 0.58 : 0;
    lidGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      lidGroupRef.current.rotation.x,
      targetRotX,
      delta * 7
    );

    // Dynamic Lid Aspect-Ratio Compensation:
    const theta = lidGroupRef.current.rotation.x;
    const effectiveLen = Math.sqrt(
      Math.cos(theta) * Math.cos(theta) * scaleZ * scaleZ +
      Math.sin(theta) * Math.sin(theta) * scaleY * scaleY
    );
    if (effectiveLen > 0.001) {
      lidGroupRef.current.scale.z = scaleZ / effectiveLen;
    }
  });

  const materialBaseColor = material === 'White' ? '#FFFFFF' : (material === 'Dreamcoat' ? '#FAF5EE' : '#C7A882');

  const customLidColor =
    (sideColors?.top && sideColors.top.toUpperCase() !== '#C7A882' ? sideColors.top : null) ||
    (sideColors?.lidFront && sideColors.lidFront.toUpperCase() !== '#C7A882' ? sideColors.lidFront : null) ||
    (sideColors?.lid && sideColors.lid.toUpperCase() !== '#C7A882' ? sideColors.lid : null);

  const customBodyColor =
    (sideColors?.front && sideColors.front.toUpperCase() !== '#C7A882' ? sideColors.front : null) ||
    (sideColors?.bottom && sideColors.bottom.toUpperCase() !== '#C7A882' ? sideColors.bottom : null) ||
    (sideColors?.back && sideColors.back.toUpperCase() !== '#C7A882' ? sideColors.back : null) ||
    (sideColors?.left && sideColors.left.toUpperCase() !== '#C7A882' ? sideColors.left : null) ||
    (sideColors?.right && sideColors.right.toUpperCase() !== '#C7A882' ? sideColors.right : null);

  const lidColorHex = isFeatureShowcase ? '#FFFFFF' : (extTexImgBlob ? '#FFFFFF' : (customLidColor || extTexColor || materialBaseColor));
  const bodyColorHex = isFeatureShowcase ? '#FFFFFF' : (extTexImgBlob ? '#FFFFFF' : (customBodyColor || extTexColor || materialBaseColor));
  const bodyMatRef = useRef();
  const lidMatRef = useRef();

  useEffect(() => {
    if (bodyMatRef.current) {
      if (extTex?.map) {
        bodyMatRef.current.map = extTex.map;
        bodyMatRef.current.map.needsUpdate = true;
      }
      bodyMatRef.current.color = new THREE.Color(bodyColorHex);
      bodyMatRef.current.needsUpdate = true;
    }
  }, [bodyColorHex, extTex.map]);

  useEffect(() => {
    if (lidMatRef.current) {
      if (extTex?.map) {
        lidMatRef.current.map = extTex.map;
        lidMatRef.current.map.needsUpdate = true;
      }
      lidMatRef.current.color = new THREE.Color(lidColorHex);
      lidMatRef.current.needsUpdate = true;
    }
  }, [lidColorHex, extTex.map]);

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      position={[0, -4.0, 0]}
      scale={cakeDimensionMaker()}
    >
      <group name="Scene">
        <group name="CakeBoxRoot">
          {/* Bakery Box Bottom Tray (Floor + 4 Walls with Lock-Corner Creases) */}
          <mesh
            name="CakeBoxTray"
            geometry={nodes.CakeBoxTray.geometry}
          >
            <meshStandardMaterial
              ref={bodyMatRef}
              {...extTex}
              color={bodyColorHex}
              roughness={0.88}
              metalness={0.02}
              side={THREE.DoubleSide}
              map-flipY={false}
            />
          </mesh>

          {/* Hinged Bakery Top Lid (with front tuck flap & side dust flaps) */}
          <group
            ref={lidGroupRef}
            name="CakeBoxLidGroup"
            position={nodes.CakeBoxLidGroup.position}
          >
            <mesh
              name="CakeBoxLid"
              geometry={nodes.CakeBoxLid.geometry}
            >
              <meshStandardMaterial
                ref={lidMatRef}
                {...extTex}
                color={lidColorHex}
                roughness={0.88}
                metalness={0.02}
                side={THREE.DoubleSide}
                map-flipY={false}
              />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/CakeBox.glb');
