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

  // DynamicBoxModel uses realistic paper grain texture, or branded texture in feature showcase mode
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

  // Apply discrete panel colors to corresponding 3D faces across all meshes in the scene
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

        const activeMap = isFeatureShowcase ? extTex.map : extTex.map;

        const createFaceMaterial = (colorHex) =>
          new THREE.MeshStandardMaterial({
            map: activeMap,
            color: new THREE.Color(isFeatureShowcase || extTexImgBlob ? '#FFFFFF' : colorHex),
            roughness: 0.85,
            metalness: 0.02,
            side: THREE.DoubleSide,
          });

        if (isLid) {
          // Top Cover Lid face color
          const lidColor = sideColors?.top || sideColors?.lidTop || sideColors?.lid || extTexColor || materialBaseColor;
          child.material = createFaceMaterial(lidColor);
          if (child.material.map) {
            child.material.map.flipY = false;
            child.material.needsUpdate = true;
          }
        } else {
          // Body / Tray mesh: 30 vertices representing the 5 box faces
          const vertexCount = child.geometry?.attributes?.position?.count;
          if (vertexCount === 30) {
            // Assign geometry groups for each face:
            // v0..v5: Bottom tray base
            // v6..v11: Back wall
            // v12..v17: Front wall
            // v18..v23: Left wall
            // v24..v29: Right wall
            if (!child.geometry._multiMaterialGrouped) {
              child.geometry.clearGroups();
              child.geometry.addGroup(0, 6, 0);  // Bottom
              child.geometry.addGroup(6, 6, 1);  // Back
              child.geometry.addGroup(12, 6, 2); // Front
              child.geometry.addGroup(18, 6, 3); // Left
              child.geometry.addGroup(24, 6, 4); // Right
              child.geometry._multiMaterialGrouped = true;
            }

            const colorBottom = sideColors?.bottom || extTexColor || materialBaseColor;
            const colorBack = sideColors?.back || extTexColor || materialBaseColor;
            const colorFront = sideColors?.front || extTexColor || materialBaseColor;
            const colorLeft = sideColors?.left || extTexColor || materialBaseColor;
            const colorRight = sideColors?.right || extTexColor || materialBaseColor;

            child.material = [
              createFaceMaterial(colorBottom),
              createFaceMaterial(colorBack),
              createFaceMaterial(colorFront),
              createFaceMaterial(colorLeft),
              createFaceMaterial(colorRight),
            ];
          } else {
            const bodyColor = sideColors?.front || sideColors?.bottom || extTexColor || materialBaseColor;
            child.material = createFaceMaterial(bodyColor);
            if (child.material.map) {
              child.material.map.flipY = false;
              child.material.needsUpdate = true;
            }
          }
        }
      }
    });
  }, [clonedScene, extTex.map, extTexImgBlob, material, extTexColor, sideColors, isFeatureShowcase, lidGroupName]);

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
