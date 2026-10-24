"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useGLTF, useAnimations, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useAppContext } from '@/context/Context';
import { createFeatureBoxTexture } from '@/lib/featureBoxTexture';

const DEFAULT_EXT_TEX = '/uploads/pizzaBoxExtTex-kraft.png';

export function PizzaBox(props) {
  const { isOpen, material, selectedSize, extTexImg, extTexImgBlob, activeItem, selectedFeatureProduct, extTexColor, sideColors } = useAppContext();

  const group = useRef();
  const generatedBlobRef = useRef(null);
  const [generatedFeatureTexUrl, setGeneratedFeatureTexUrl] = useState(null);

  const dimenstionsValue = selectedSize;

  const boxDimensionMaker = () => {
    let len = Math.max(1, parseFloat(dimenstionsValue?.length) || 12);
    let wid = Math.max(1, parseFloat(dimenstionsValue?.width) || 12);
    let dep = Math.max(0.5, parseFloat(dimenstionsValue?.depth) || 1.8);

    // Realistic pizza box depth ratio:
    // Scaling Y by dep * 0.925 gives an authentic 15% height proportion for 1.8" depth
    const scaleX = -len / 10;
    const scaleZ = wid / 10;
    const scaleY = dep * 0.925;

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

  const materialBaseColor = material === 'White' ? '#FFFFFF' : (material === 'Dreamcoat' ? '#FAF5EE' : '#C7A882');
  const customColor =
    (extTexColor && extTexColor.toUpperCase() !== '#C7A882' && extTexColor.toUpperCase() !== '#FAF5EE' ? extTexColor : null) ||
    (sideColors?.lidTop && sideColors.lidTop.toUpperCase() !== '#C7A882' ? sideColors.lidTop : null) ||
    (sideColors?.top && sideColors.top.toUpperCase() !== '#C7A882' ? sideColors.top : null) ||
    (sideColors?.bottom && sideColors.bottom.toUpperCase() !== '#C7A882' ? sideColors.bottom : null) ||
    (sideColors?.front && sideColors.front.toUpperCase() !== '#C7A882' ? sideColors.front : null);

  const appliedColorHex = isFeatureShowcase
    ? '#FFFFFF'
    : (extTexImgBlob
      ? '#FFFFFF'
      : (customColor || extTexColor || materialBaseColor));

  const defaultExtTex = material === 'White'
    ? '/whiteCoatTexture.jpg'
    : (extTexImg
      ? (extTexImg.startsWith('/') ? extTexImg : `/uploads/${extTexImg}`)
      : '/pizzaBoxExtTex-kraft.png');

  const hasCustomColor = !isFeatureShowcase && appliedColorHex && appliedColorHex.toUpperCase() !== '#C7A882';

  const extTexMapUrl = isFeatureShowcase
    ? (generatedFeatureTexUrl || defaultExtTex)
    : (extTexImgBlob || (hasCustomColor ? '/whiteCoatTexture.jpg' : (defaultExtTex || '/pizzaBoxExtTex-kraft.png')));

  const extTex = useTexture({ map: extTexMapUrl });

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
  const { scene, animations } = useGLTF('/PizzaBox.glb');
  const { actions } = useAnimations(animations, group);

  // Apply exterior and interior textures to the pizza box skinned meshes
  useEffect(() => {
    if (!scene) return;
    const appliedColor = appliedColorHex || materialBaseColor;

    scene.traverse((child) => {
      if (child.isSkinnedMesh || child.isMesh) {
        const matName = child.material?.name || '';
        const isExterior = matName === 'CardBoardExterior' || child.name.includes('_1');
        const activeTexture = isExterior ? extTex.map : intTex.map;

        child.material = new THREE.MeshStandardMaterial({
          map: activeTexture,
          color: isExterior ? new THREE.Color(appliedColor) : new THREE.Color(0xffffff),
          roughness: isExterior ? 0.85 : 0.9,
          metalness: 0.02,
          side: THREE.DoubleSide,
        });

        if (child.material.map) {
          child.material.map.flipY = false;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene, extTex.map, intTex.map, material, extTexColor, sideColors, isFeatureShowcase]);

  const topBone = React.useMemo(() => {
    let found = null;
    if (scene) {
      scene.traverse((obj) => {
        if (obj.name === 'Top') found = obj;
      });
    }
    return found;
  }, [scene]);

  const initializedAnim = useRef(false);

  // Initialize Close action in paused state at correct Open/Close timestamp
  useEffect(() => {
    if (!actions || !actions.Close) return;
    const action = actions.Close;
    if (!initializedAnim.current) {
      action.play();
      action.paused = true;
      action.time = isOpen ? 0.0 : 1.8;
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
      // In PizzaBox.glb Close clip: t=0.0s is fully OPEN, t=1.8s is fully CLOSED
      const targetTime = isOpen ? 0.0 : 1.8;
      closeAction.time = THREE.MathUtils.lerp(closeAction.time, targetTime, delta * 8);

      // Dynamic Open Lid Aspect-Ratio Compensation:
      // When the pizza box lid is open, its physical length stands along world Y (scaled by scaleY).
      // Compensating Top.scale.y by (scaleZ / scaleY) guarantees that the open lid's length
      // strictly scales with box width (scaleZ) rather than vertical depth (scaleY),
      // ensuring that when length and width are decreased, the open lid scales down proportionally!
      if (topBone) {
        const openAlpha = Math.max(0, Math.min(1, (1.8 - closeAction.time) / 1.8));
        const targetScaleY = 1.0 + openAlpha * (scaleZ / Math.max(0.01, scaleY) - 1.0);
        topBone.scale.y = targetScaleY;
      }
    }
  });

  return (
    <group ref={group} {...props} dispose={null} position={[0, -4, 0]} scale={boxDimensionMaker()}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/PizzaBox.glb');
