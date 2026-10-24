"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useGLTF, useAnimations, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useAppContext } from '@/context/Context';
import { createFeatureBoxTexture } from '@/lib/featureBoxTexture';

const DEFAULT_EXT_TEX = '/uploads/MailerBoxOuterTex-Kraft.png';

const FEATURE_LOGO_PATHS = {
  DHL: '/products/feature/DHL.png',
  FedEx: '/products/feature/FEDEX.png',
  TCS: '/products/feature/TCS.png',
  UPS: '/products/feature/UPS.png',
  LEOPARDS: '/products/feature/Leopards.png',
};

export function MailerBox(props) {
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

  const boxDimensionMaker = () => {
    let len = Math.max(1, parseFloat(dimenstionsValue?.length) || 10);
    let wid = Math.max(1, parseFloat(dimenstionsValue?.width) || 10);
    let dep = Math.max(0.5, parseFloat(dimenstionsValue?.depth) || 4);

    return [-len / 10, dep / 4, wid / 10];
  };

  const isFeatureShowcase = activeItem === 'featureproduct' && selectedFeatureProduct;
  const featureLogoUrl = isFeatureShowcase && FEATURE_LOGO_PATHS[selectedFeatureProduct] ? FEATURE_LOGO_PATHS[selectedFeatureProduct] : null;

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
    createFeatureBoxTexture(selectedFeatureProduct, featureLogoUrl)
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
  }, [isFeatureShowcase, selectedFeatureProduct, featureLogoUrl]);

  const extMaterialRef = useRef();

  useEffect(() => {
    return () => {
      if (generatedBlobRef.current) {
        URL.revokeObjectURL(generatedBlobRef.current);
        generatedBlobRef.current = null;
      }
    };
  }, []);

  const materialBaseColor = material === 'White' ? '#FFFFFF' : (material === 'Dreamcoat' ? '#FAF5EE' : '#C7A882');

  // Detect any custom color picked for panels or whole box
  const customColor =
    (extTexColor && extTexColor.toUpperCase() !== '#C7A882' && extTexColor.toUpperCase() !== '#FAF5EE' ? extTexColor : null) ||
    (sideColors?.top && sideColors.top.toUpperCase() !== '#C7A882' ? sideColors.top : null) ||
    (sideColors?.lidFront && sideColors.lidFront.toUpperCase() !== '#C7A882' ? sideColors.lidFront : null) ||
    (sideColors?.front && sideColors.front.toUpperCase() !== '#C7A882' ? sideColors.front : null) ||
    (sideColors?.bottom && sideColors.bottom.toUpperCase() !== '#C7A882' ? sideColors.bottom : null) ||
    (sideColors?.back && sideColors.back.toUpperCase() !== '#C7A882' ? sideColors.back : null) ||
    (sideColors?.left && sideColors.left.toUpperCase() !== '#C7A882' ? sideColors.left : null) ||
    (sideColors?.right && sideColors.right.toUpperCase() !== '#C7A882' ? sideColors.right : null);

  const appliedColorHex = isFeatureShowcase
    ? '#FFFFFF'
    : (customColor || extTexColor || materialBaseColor);

  const hasCustomColor = !isFeatureShowcase && appliedColorHex && appliedColorHex.toUpperCase() !== '#C7A882' && appliedColorHex.toUpperCase() !== '#FAF5EE';

  const defaultExtTex = material === 'White'
    ? '/uploads/MailerBoxOuterTex-White.png'
    : (material === 'Dreamcoat'
      ? '/uploads/MailerBoxOuterTex-Dreamcoat.png'
      : (extTexImg
        ? (extTexImg.startsWith('/') ? extTexImg : `/uploads/${extTexImg}`)
        : DEFAULT_EXT_TEX));

  // When a custom color is active, use the white texture map so colors multiply with pure fidelity
  const extTexMapUrl = isFeatureShowcase
    ? (generatedFeatureTexUrl || DEFAULT_EXT_TEX)
    : (extTexImgBlob || (hasCustomColor ? '/uploads/MailerBoxOuterTex-White.png' : defaultExtTex));

  const extTex = useTexture({ map: extTexMapUrl });

  useEffect(() => {
    if (extMaterialRef.current) {
      extMaterialRef.current.color = new THREE.Color(appliedColorHex);
      extMaterialRef.current.needsUpdate = true;
    }
  }, [appliedColorHex]);

  const [matObject, setMatObject] = useState({
    map: '/pizzaIntTexKraft.png',
  });

  useEffect(() => {
    if (material === 'White') {
      setMatObject({
        map: '/pizzaIntTexWhite.png',
      });
    } else if (material === 'Dreamcoat') {
      setMatObject({
        map: '/pizzaIntTexDreamcoat.png',
      });
    } else {
      setMatObject({
        map: '/pizzaIntTexKraft.png',
      });
    }
  }, [material]);

  const intTex = useTexture(matObject);

  const { nodes, materials, animations } = useGLTF('/MailerBox.glb');
  const { actions } = useAnimations(animations, group);
  const initializedAnim = useRef(false);

  // Initialize Close action in paused state at correct Open/Close timestamp (2.083s is fully closed & tucked)
  useEffect(() => {
    if (!actions || !actions.Close) return;
    const action = actions.Close;
    if (!initializedAnim.current) {
      action.play();
      action.paused = true;
      action.time = isOpen ? 0.0 : 2.083;
      initializedAnim.current = true;
    }
  }, [actions, isOpen]);

  // Drive root group scale smoothly and scrub lid animation seamlessly
  useFrame((state, delta) => {
    const [scaleX, scaleY, scaleZ] = boxDimensionMaker();

    if (group.current) {
      if (Math.sign(group.current.scale.x) !== Math.sign(scaleX)) {
        group.current.scale.x = scaleX;
      } else {
        group.current.scale.x = THREE.MathUtils.lerp(group.current.scale.x, scaleX, delta * 10);
      }
      group.current.scale.y = THREE.MathUtils.lerp(group.current.scale.y, scaleY, delta * 10);
      group.current.scale.z = THREE.MathUtils.lerp(group.current.scale.z, scaleZ, delta * 10);
    }

    const closeAction = actions?.Close;
    if (closeAction) {
      if (!closeAction.isRunning()) {
        closeAction.play();
        closeAction.paused = true;
      }
      // In MailerBox.glb Close clip: t=0.0s is fully OPEN, t=2.083s is fully CLOSED with front flap tucked
      const targetTime = isOpen ? 0.0 : 2.083;
      closeAction.time = THREE.MathUtils.lerp(closeAction.time, targetTime, delta * 8);

      // Open lid aspect-ratio compensation on hinge bone
      if (nodes.Bone003) {
        const openAlpha = Math.max(0, Math.min(1, (2.083 - closeAction.time) / 2.083));
        const targetScaleY = 1.0 + openAlpha * (scaleZ / Math.max(0.01, scaleY) - 1.0);
        nodes.Bone003.scale.y = targetScaleY;
      }
    }
  });

  return (
    <group ref={group} {...props} dispose={null} position={[0, -4, 0]} scale={boxDimensionMaker()}>
      <group name="Scene">
        <group name="Armature" position={[-0.001, 4.328, -2.228]}>
          <primitive object={nodes.Bone} />
          <primitive object={nodes.neutral_bone} />
          <mesh>
            <mesh>
              <skinnedMesh name="Plane" geometry={nodes.Plane.geometry} skeleton={nodes.Plane.skeleton}>
                <meshStandardMaterial {...intTex} side={THREE.FrontSide} map-flipY={false} />
              </skinnedMesh>
            </mesh>
            <mesh>
              <skinnedMesh name="Plane" geometry={nodes.Plane.geometry} skeleton={nodes.Plane.skeleton}>
                <meshStandardMaterial
                  ref={extMaterialRef}
                  {...extTex}
                  color={new THREE.Color(appliedColorHex)}
                  roughness={0.85}
                  metalness={0.02}
                  side={THREE.BackSide}
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

useGLTF.preload('/MailerBox.glb');
