"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import * as THREE from "three";
import { useMemo } from "react";

function Model({ url }: { url: string }) {
    const geom = useLoader(STLLoader, url);

    useMemo(() => {
        geom.computeBoundingBox();
        const bb = geom.boundingBox!;
        const center = bb.getCenter(new THREE.Vector3());
        geom.translate(-center.x, -center.y, -center.z);
        const size = bb.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
            const scale = 1 / maxDim; // fit into ~unit cube
            geom.scale(scale, scale, scale);
        }
    }, [geom]);

    return (
        <mesh geometry={geom}>
            <meshStandardMaterial metalness={0.1} roughness={0.6} />
        </mesh>
    );
}

export default function STLViewer({ src }: { src: string }) {
    return (
        <Canvas camera={{ position: [1.8, 1.2, 1.8], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[3, 5, 2]} intensity={1} />
            <Model url={src} />
            <OrbitControls />
        </Canvas>
    );
}
