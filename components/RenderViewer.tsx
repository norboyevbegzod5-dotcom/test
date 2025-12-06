'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Cabinet } from '@/lib/types'
import * as THREE from 'three'

function CabinetModel({ cabinet }: { cabinet: Cabinet }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      // Optional: Add rotation animation
    }
  })

  const scale = 0.01 // Convert mm to units (1 unit = 1cm, so 0.01 = 1mm)

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Side Panels */}
      {cabinet.sidePanels.map((side, index) => (
        <mesh
          key={side.id}
          position={[
            index === 0 ? -cabinet.dimensions.width * scale / 2 + side.thickness * scale / 2
              : cabinet.dimensions.width * scale / 2 - side.thickness * scale / 2,
            0,
            0,
          ]}
        >
          <boxGeometry args={[side.width * scale, side.height * scale, side.thickness * scale]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      ))}

      {/* Top */}
      <mesh
        position={[
          0,
          cabinet.dimensions.height * scale / 2 - cabinet.topBottom.top.thickness * scale / 2,
          0,
        ]}
      >
        <boxGeometry args={[
          cabinet.topBottom.top.width * scale,
          cabinet.topBottom.top.thickness * scale,
          cabinet.topBottom.top.depth * scale,
        ]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>

      {/* Bottom */}
      <mesh
        position={[
          0,
          -cabinet.dimensions.height * scale / 2 + cabinet.topBottom.bottom.thickness * scale / 2,
          0,
        ]}
      >
        <boxGeometry args={[
          cabinet.topBottom.bottom.width * scale,
          cabinet.topBottom.bottom.thickness * scale,
          cabinet.topBottom.bottom.depth * scale,
        ]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>

      {/* Shelves */}
      {cabinet.shelves.map((shelf, index) => {
        const shelfSpacing = cabinet.dimensions.height / (cabinet.shelves.length + 1)
        return (
          <mesh
            key={shelf.id}
            position={[
              0,
              -cabinet.dimensions.height * scale / 2 + (index + 1) * shelfSpacing * scale,
              cabinet.dimensions.depth * scale / 2 - shelf.depth * scale / 2,
            ]}
          >
            <boxGeometry args={[shelf.width * scale, shelf.thickness * scale, shelf.depth * scale]} />
            <meshStandardMaterial color="#CD853F" />
          </mesh>
        )
      })}

      {/* Partitions */}
      {cabinet.partitions.map((partition, index) => {
        const partitionSpacing = cabinet.dimensions.width / (cabinet.partitions.length + 1)
        return (
          <mesh
            key={partition.id}
            position={[
              -cabinet.dimensions.width * scale / 2 + (index + 1) * partitionSpacing * scale,
              0,
              0,
            ]}
          >
            <boxGeometry args={[
              partition.thickness * scale,
              partition.height * scale,
              partition.width * scale,
            ]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        )
      })}

      {/* Doors */}
      {cabinet.doors.map((door, index) => {
        const doorWidth = cabinet.dimensions.width / cabinet.doors.length
        const doorThickness = door.material.thickness
        return (
          <mesh
            key={door.id}
            position={[
              -cabinet.dimensions.width * scale / 2 + (index + 0.5) * doorWidth * scale,
              0,
              cabinet.dimensions.depth * scale / 2 + doorThickness * scale / 2 + 5 * scale,
            ]}
          >
            <boxGeometry args={[doorThickness * scale, door.height * scale, door.width * scale]} />
            <meshStandardMaterial color="#D2691E" />
          </mesh>
        )
      })}

      {/* Base */}
      <mesh
        position={[
          0,
          -cabinet.dimensions.height * scale / 2 - cabinet.base.height * scale / 2,
          0,
        ]}
      >
        <boxGeometry args={[
          cabinet.base.width * scale,
          cabinet.base.height * scale,
          cabinet.base.depth * scale,
        ]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
    </group>
  )
}

export function RenderViewer({ cabinet }: { cabinet: Cabinet }) {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[5, 3, 5]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      <CabinetModel cabinet={cabinet} />
      <OrbitControls enableDamping dampingFactor={0.05} />
      <gridHelper args={[10, 10]} />
    </Canvas>
  )
}
