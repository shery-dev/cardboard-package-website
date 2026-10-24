"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { useAppContext } from '@/context/Context';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createFeatureBoxTexture } from '@/lib/featureBoxTexture';

const DEFAULT_EXT_TEX = '/kraftTexture.jpg';

export function KraftPaperBag(props) {
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
  const generatedBlobRef = useRef(null);
  const [generatedFeatureTexUrl, setGeneratedFeatureTexUrl] = useState(null);
  const dimenstionsValue = selectedSize;

  /**
   * Kraft Paper Carry Bag Scaling:
   * - Length: Front face width (e.g. 9″, 12″, 14″) -> scales X
   * - Width:  Side gusset depth (e.g. 5″, 6.5″, 8.5″) -> scales Z (normalized to base 6″)
   * - Depth:  Vertical height (e.g. 10″, 12″, 14″) -> scales Y
   *
   * The bag base is at y = 0 locally, so position={[0, -4.0, 0]} grounds it
   * flush with the contact shadows and floor at y = -4.00.
   */
  const bagDimensionMaker = () => {
    const len = Math.max(1, parseFloat(dimenstionsValue?.length) || 10);
    const wid = Math.max(1, parseFloat(dimenstionsValue?.width) || 6);
    const dep = Math.max(1, parseFloat(dimenstionsValue?.depth) || 10);

    const scaleX = (len / 10);
    const scaleZ = (wid / 6);
    const scaleY = (dep / 10);

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
    : defaultExtTex;

  const extTex = useTexture({ map: extTexMapUrl });

  // Handle color based on material
  const handleColor = material === 'White'
    ? '#D8D4CE'
    : material === 'Dreamcoat'
    ? '#C4A882'
    : '#9C6E42';

  const { nodes } = useGLTF('/KraftPaperBag.glb');

  // Subtle breathing / flex animation on open/close
  useFrame((state, delta) => {
    if (!group.current) return;
    const targetScale = bagDimensionMaker();
    const currentScale = group.current.scale;
    currentScale.x = THREE.MathUtils.lerp(currentScale.x, targetScale[0], delta * 6);
    currentScale.y = THREE.MathUtils.lerp(currentScale.y, targetScale[1], delta * 6);
    currentScale.z = THREE.MathUtils.lerp(currentScale.z, targetScale[2] * (isOpen ? 1.0 : 0.4), delta * 6);
  });

  const materialBaseColor = material === 'White' ? '#FFFFFF' : (material === 'Dreamcoat' ? '#FAF5EE' : '#C7A882');

  const colorFront = sideColors?.front || extTexColor || materialBaseColor;
  const colorBack = sideColors?.back || extTexColor || materialBaseColor;
  const colorLeft = sideColors?.left || extTexColor || materialBaseColor;
  const colorRight = sideColors?.right || extTexColor || materialBaseColor;
  const colorBottom = sideColors?.bottom || extTexColor || materialBaseColor;

  useEffect(() => {
    if (nodes?.PlaneWOA?.geometry) {
      const geom = nodes.PlaneWOA.geometry;
      if (!geom._multiMaterialGrouped) {
        geom.clearGroups();
        geom.addGroup(0, 6, 0);   // Front
        geom.addGroup(6, 6, 1);   // Back
        geom.addGroup(12, 12, 2); // Left
        geom.addGroup(24, 6, 3);  // Right
        geom.addGroup(30, 6, 4);  // Bottom
        geom._multiMaterialGrouped = true;
      }
    }
  }, [nodes]);

  const createFaceMat = (hex) =>
    new THREE.MeshStandardMaterial({
      map: isFeatureShowcase ? extTex.map : extTex.map,
      color: new THREE.Color(isFeatureShowcase ? '#FFFFFF' : hex),
      roughness: 0.88,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

  const bagMaterials = React.useMemo(() => [
    createFaceMat(colorFront),
    createFaceMat(colorBack),
    createFaceMat(colorLeft),
    createFaceMat(colorRight),
    createFaceMat(colorBottom),
  ], [colorFront, colorBack, colorLeft, colorRight, colorBottom, isFeatureShowcase, extTex.map]);

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      position={[0, -4.0, 0]}
      scale={bagDimensionMaker()}
    >
      <group name="Scene">
        <group name="KraftBagRoot">
          {/* Main Paper Bag Body with distinct panel colors */}
          <mesh
            name="PlaneWOA"
            geometry={nodes.PlaneWOA.geometry}
            material={bagMaterials}
          />

          {/* Front Twisted Rope Handle */}
          <mesh
            name="HandleFront"
            geometry={nodes.HandleFront.geometry}
          >
            <meshStandardMaterial
              color={handleColor}
              roughness={0.95}
              metalness={0.0}
            />
          </mesh>

          {/* Back Twisted Rope Handle */}
          <mesh
            name="HandleBack"
            geometry={nodes.HandleBack.geometry}
          >
            <meshStandardMaterial
              color={handleColor}
              roughness={0.95}
              metalness={0.0}
            />
          </mesh>

          {/* Handle Reinforcement Patches */}
          {nodes.PatchFL && (
            <mesh geometry={nodes.PatchFL.geometry} position={nodes.PatchFL.position}>
              <meshStandardMaterial color="#B58E62" roughness={0.9} side={THREE.DoubleSide} />
            </mesh>
          )}
          {nodes.PatchFR && (
            <mesh geometry={nodes.PatchFR.geometry} position={nodes.PatchFR.position}>
              <meshStandardMaterial color="#B58E62" roughness={0.9} side={THREE.DoubleSide} />
            </mesh>
          )}
          {nodes.PatchBL && (
            <mesh geometry={nodes.PatchBL.geometry} position={nodes.PatchBL.position} rotation={nodes.PatchBL.rotation}>
              <meshStandardMaterial color="#B58E62" roughness={0.9} side={THREE.DoubleSide} />
            </mesh>
          )}
          {nodes.PatchBR && (
            <mesh geometry={nodes.PatchBR.geometry} position={nodes.PatchBR.position} rotation={nodes.PatchBR.rotation}>
              <meshStandardMaterial color="#B58E62" roughness={0.9} side={THREE.DoubleSide} />
            </mesh>
          )}
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/KraftPaperBag.glb');
