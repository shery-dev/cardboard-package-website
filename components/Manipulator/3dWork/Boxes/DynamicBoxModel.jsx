"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { useAppContext } from '@/context/Context';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createFeatureBoxTexture } from '@/lib/featureBoxTexture';

const DEFAULT_EXT_TEX = '/kraftTexture.jpg';

/**
 * DynamicBoxModel: Parametric Three.js renderer for distinct packaging geometries
 * Supports telescoping lids (GiftBox, ApparelBox) and hinged lids with tailored brand texturing.
 */
export function DynamicBoxModel({
  glbPath,
  baseDimensions = { len: 10, wid: 10, dep: 4 },
  isTelescoping = false,
  openAngle = -Math.PI * 0.55,
  liftAmount = 1.6,
  closedY = 0,
  lidGroupName,
  ...props
}) {
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

  const calculateScale = () => {
    const len = Math.max(1, parseFloat(dimenstionsValue?.length) || baseDimensions.len);
    const wid = Math.max(1, parseFloat(dimenstionsValue?.width) || baseDimensions.wid);
    const dep = Math.max(0.5, parseFloat(dimenstionsValue?.depth) || baseDimensions.dep);

    const scaleX = len / baseDimensions.len;
    const scaleZ = wid / baseDimensions.wid;
    const scaleY = dep / baseDimensions.dep;

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

  // For 3D GLTF models, support extTexImgBlob for custom artwork/colors or default to clean paper texture
  const extTexMapUrl = isFeatureShowcase
    ? (generatedFeatureTexUrl || defaultExtTex)
    : (extTexImgBlob || defaultExtTex);

  const extTex = useTexture({ map: extTexMapUrl });
  const { scene } = useGLTF(glbPath);

  // Clone scene so multiple instances don't collide
  const clonedScene = React.useMemo(() => scene.clone(true), [scene]);

  // Find the lid group by name or by group inside scene
  const targetLid = React.useMemo(() => {
    let found = null;
    if (lidGroupName) {
      clonedScene.traverse((obj) => {
        if (obj.name === lidGroupName) found = obj;
      });
    }
    if (!found) {
      clonedScene.traverse((obj) => {
        if (!found && obj.isGroup && (obj.name.toLowerCase().includes('lid') || obj.name.toLowerCase().includes('flap'))) {
          found = obj;
        }
      });
    }
    return found;
  }, [clonedScene, lidGroupName]);

  const initializedTelescopeRef = useRef(false);

  useEffect(() => {
    initializedTelescopeRef.current = false;
  }, [glbPath]);

  // Smooth lid animation and active dynamic dimension scaling
  useFrame((state, delta) => {
    const [scaleX, scaleY, scaleZ] = calculateScale();

    // Drive root group scale smoothly so dimensions update dynamically
    if (group.current) {
      group.current.scale.x = THREE.MathUtils.lerp(group.current.scale.x, scaleX, delta * 10);
      group.current.scale.y = THREE.MathUtils.lerp(group.current.scale.y, scaleY, delta * 10);
      group.current.scale.z = THREE.MathUtils.lerp(group.current.scale.z, scaleZ, delta * 10);
    }

    if (!targetLid) return;

    if (isTelescoping) {
      if (!initializedTelescopeRef.current) {
        targetLid.position.y = isOpen ? liftAmount : closedY;
        initializedTelescopeRef.current = true;
      } else {
        const targetY = isOpen ? liftAmount : closedY;
        targetLid.position.y = THREE.MathUtils.lerp(targetLid.position.y, targetY, delta * 6);
      }
    } else {
      const targetRotX = isOpen ? openAngle : 0;
      targetLid.rotation.x = THREE.MathUtils.lerp(targetLid.rotation.x, targetRotX, delta * 7);

      // Dynamic Lid Aspect-Ratio Compensation:
      // When the lid rotates open around X by angle theta, its local Z axis rotates into world Y.
      // In a group with non-uniform scaling (scaleY != scaleZ), this rotation causes the lid's
      // length to be scaled by scaleY (box depth) instead of scaleZ (box width).
      // Compensating targetLid.scale.z ensures the lid's physical length ALWAYS matches scaleZ (the box width)
      // at any angle, open or closed, so changing Width or Length in the size tool dynamically resizes the lid!
      const theta = targetLid.rotation.x;
      const effectiveLen = Math.sqrt(
        Math.cos(theta) * Math.cos(theta) * scaleZ * scaleZ +
        Math.sin(theta) * Math.sin(theta) * scaleY * scaleY
      );
      if (effectiveLen > 0.001) {
        targetLid.scale.z = scaleZ / effectiveLen;
      }
    }
  });

  // Apply active textures and panel colors to meshes in the cloned scene
  React.useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        // Skip specialized metallic/rubber accents like corner brackets, tape, windows, or handles
        if (
          child.name.includes('CornerBracket') ||
          child.name.includes('AdhesiveTape') ||
          child.name.includes('Zipper') ||
          child.name.includes('Magnetic') ||
          child.name.includes('SteamVent') ||
          child.name.includes('HandHole') ||
          child.name.includes('ReinforcedTape') ||
          child.name.includes('LaptopCradle') ||
          child.name.includes('CableDivider') ||
          child.name.includes('ViewingWindow')
        ) {
          return;
        }

        const isLid = child.name.toLowerCase().includes('lid') || (lidGroupName && child.name.includes(lidGroupName));
        const materialBaseColor = material === 'White' ? '#FFFFFF' : (material === 'Dreamcoat' ? '#FAF5EE' : '#C7A882');

        const customLidColor =
          (sideColors?.top && sideColors.top.toUpperCase() !== '#C7A882' ? sideColors.top : null) ||
          (sideColors?.lidFront && sideColors.lidFront.toUpperCase() !== '#C7A882' ? sideColors.lidFront : null) ||
          (sideColors?.lid && sideColors.lid.toUpperCase() !== '#C7A882' ? sideColors.lid : null) ||
          (sideColors?.lidTop && sideColors.lidTop.toUpperCase() !== '#C7A882' ? sideColors.lidTop : null);

        const customBodyColor =
          (sideColors?.front && sideColors.front.toUpperCase() !== '#C7A882' ? sideColors.front : null) ||
          (sideColors?.bottom && sideColors.bottom.toUpperCase() !== '#C7A882' ? sideColors.bottom : null) ||
          (sideColors?.back && sideColors.back.toUpperCase() !== '#C7A882' ? sideColors.back : null) ||
          (sideColors?.left && sideColors.left.toUpperCase() !== '#C7A882' ? sideColors.left : null) ||
          (sideColors?.right && sideColors.right.toUpperCase() !== '#C7A882' ? sideColors.right : null);

        const appliedColorHex = isFeatureShowcase
          ? '#FFFFFF'
          : (extTexImgBlob
            ? '#FFFFFF'
            : (isLid ? (customLidColor || extTexColor || materialBaseColor) : (customBodyColor || extTexColor || materialBaseColor)));

        child.material = new THREE.MeshStandardMaterial({
          map: extTex.map,
          color: new THREE.Color(appliedColorHex),
          roughness: 0.85,
          metalness: 0.02,
          side: THREE.DoubleSide,
        });

        if (child.material.map) {
          child.material.map.flipY = false;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [clonedScene, extTex.map, material, extTexColor, sideColors, isFeatureShowcase, lidGroupName]);

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      position={[0, -4.0, 0]}
      scale={calculateScale()}
    >
      <primitive object={clonedScene} />
    </group>
  );
}
