"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useGLTF, useAnimations, useTexture } from '@react-three/drei';
import { useAppContext } from '@/context/Context';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createFeatureBoxTexture } from '@/lib/featureBoxTexture';

const DEFAULT_EXT_TEX = '/uploads/SBD.png';

export function ShippingBox(props) {
  const {
    isOpen,
    material,
    selectedSize,
    extTexImg,
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
   * Geometry & Aspect-Ratio Normalization:
   * In ShippingBoxPlaneMesh.glb:
   * - Local Z spans Left-to-Right flaps (Length of box) with base span ~2.435
   * - Local X spans Front-to-Back flaps (Width of box) with base span ~2.260
   * - Local Y spans bottom-to-top (Depth / Height) with base span ~0.827
   *
   * By rotating the model -90 degrees around Y:
   * - Local Z aligns to world X (Length, left-to-right across camera view)
   * - Local X aligns to world -Z (Width, front-to-back depth)
   * - Local Y aligns to world Y (Depth / vertical height)
   *
   * Aspect normalization factors (calibrated so 10×10×10 produces a true 1:1:1 equilateral cube):
   * - Length (local Z): (len / 10) * 1.45 => ~3.53 units for 10"
   * - Width  (local X): (wid / 10) * 1.55 => ~3.50 units for 10"
   * - Depth  (local Y): (dep / 10) * 4.25 => ~3.51 units for 10"
   *
   * Grounding:
   * Local bottom vertex is at y = -0.416. Scaled by scaleY, local bottom is -0.416 * scaleY.
   * Setting root position.y = -4.0 + (0.416 * scaleY) grounds the box baseline at exactly y = -4.00,
   * flush with the contact shadows and aligned with MailerBox and PizzaBox.
   */
  const boxDimensionMaker = () => {
    const len = Math.max(1, parseFloat(dimenstionsValue?.length) || 15);
    const wid = Math.max(1, parseFloat(dimenstionsValue?.width) || 12);
    const dep = Math.max(0.5, parseFloat(dimenstionsValue?.depth) || 10);

    const scaleX = (wid / 10) * 1.55;
    const scaleY = (dep / 10) * 4.25;
    const scaleZ = (len / 10) * 1.45;

    return {
      scale: [scaleX, scaleY, scaleZ],
      position: [0, -4.0 + 0.416 * scaleY, 0],
    };
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

  const materialBaseColor = material === 'White' ? '#FFFFFF' : (material === 'Dreamcoat' ? '#FAF5EE' : '#C7A882');
  const customColor =
    (extTexColor && extTexColor.toUpperCase() !== '#C7A882' && extTexColor.toUpperCase() !== '#FAF5EE' ? extTexColor : null) ||
    (sideColors?.front && sideColors.front.toUpperCase() !== '#C7A882' ? sideColors.front : null) ||
    (sideColors?.top && sideColors.top.toUpperCase() !== '#C7A882' ? sideColors.top : null) ||
    (sideColors?.bottom && sideColors.bottom.toUpperCase() !== '#C7A882' ? sideColors.bottom : null);

  const appliedColorHex = isFeatureShowcase
    ? '#FFFFFF'
    : (extTexImgBlob
      ? '#FFFFFF'
      : (customColor || extTexColor || materialBaseColor));
  const hasCustomColor = !isFeatureShowcase && appliedColorHex && appliedColorHex.toUpperCase() !== '#C7A882';

  const defaultExtTex = material === 'White'
    ? '/whiteCoatTexture.jpg'
    : (extTexImg ? `/uploads/${extTexImg}` : DEFAULT_EXT_TEX);

  const extTexMapUrl = isFeatureShowcase
    ? (generatedFeatureTexUrl || defaultExtTex)
    : (extTexImgBlob || (hasCustomColor ? '/whiteCoatTexture.jpg' : defaultExtTex));

  const extTex = useTexture({ map: extTexMapUrl });
  const extMaterialRef = useRef();

  useEffect(() => {
    if (extMaterialRef.current) {
      if (extTex?.map) {
        extMaterialRef.current.map = extTex.map;
        extMaterialRef.current.map.needsUpdate = true;
      }
      extMaterialRef.current.color = new THREE.Color(appliedColorHex);
      extMaterialRef.current.needsUpdate = true;
    }
  }, [appliedColorHex, extTex.map]);

  const [matObject, setMatObject] = useState({
    map: '/shippingIntTexKraft.png',
  });

  useEffect(() => {
    if (material === 'White') {
      setMatObject({
        map: '/shippingIntTexWhite.png',
      });
    } else if (material === 'Dreamcoat') {
      setMatObject({
        map: '/shippingIntTexDreamcoat.png',
      });
    } else {
      setMatObject({
        map: '/shippingIntTexKraft.png',
      });
    }
  }, [material]);

  const intTex = useTexture(matObject);

  const { nodes, materials, animations } = useGLTF('/ShippingBoxPlaneMesh.glb');
  const { actions } = useAnimations(animations, group);
  const isFirstRender = useRef(true);

  // Smooth, non-jittering animation: triggers only when isOpen changes
  useEffect(() => {
    if (!actions || !actions.Open || !actions.Close) return;

    const openAction = actions.Open;
    const closeAction = actions.Close;

    openAction.clampWhenFinished = true;
    closeAction.clampWhenFinished = true;
    openAction.setLoop(THREE.LoopOnce);
    closeAction.setLoop(THREE.LoopOnce);

    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (isOpen) {
        openAction.reset().play();
      } else {
        closeAction.reset().play();
      }
      return;
    }

    if (isOpen) {
      closeAction.fadeOut(0.3);
      openAction.reset().fadeIn(0.3).play();
    } else {
      openAction.fadeOut(0.3);
      closeAction.reset().fadeIn(0.3).play();
    }
  }, [isOpen, actions]);

  // Drive root group scale and grounded position smoothly so dimensions update dynamically
  useFrame((state, delta) => {
    if (!group.current) return;
    const currentDims = boxDimensionMaker();
    group.current.scale.x = THREE.MathUtils.lerp(group.current.scale.x, currentDims.scale[0], delta * 10);
    group.current.scale.y = THREE.MathUtils.lerp(group.current.scale.y, currentDims.scale[1], delta * 10);
    group.current.scale.z = THREE.MathUtils.lerp(group.current.scale.z, currentDims.scale[2], delta * 10);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, currentDims.position[1], delta * 10);
  });

  const dims = boxDimensionMaker();

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      position={dims.position}
      rotation={[0, -Math.PI / 2, 0]}
      scale={dims.scale}
    >
      <group name="Scene">
        <group name="Armature001">
          <primitive object={nodes.body} />
          <mesh>
            <mesh>
              <skinnedMesh
                name="PlaneWOA"
                geometry={nodes.PlaneWOA.geometry}
                skeleton={nodes.PlaneWOA.skeleton}
              >
                <meshStandardMaterial {...intTex} side={THREE.BackSide} map-flipY={false} />
              </skinnedMesh>
            </mesh>
            <mesh>
              <skinnedMesh
                name="PlaneWOA"
                geometry={nodes.PlaneWOA.geometry}
                skeleton={nodes.PlaneWOA.skeleton}
              >
                <meshStandardMaterial
                  ref={extMaterialRef}
                  {...extTex}
                  color={new THREE.Color(appliedColorHex)}
                  roughness={0.85}
                  metalness={0.02}
                  side={THREE.FrontSide}
                  map-flipY={false}
                />
              </skinnedMesh>
            </mesh>
          </mesh>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/ShippingBoxPlaneMesh.glb');
