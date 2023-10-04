import { useFrame, useThree } from "@react-three/fiber";
import {
  useKeyboardControls,
  PointerLockControls,
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  useNormalTexture,
} from "@react-three/drei";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { PublicApi, Triplet, useSphere, useLockConstraint, BoxProps, useBox, SphereProps, useCylinder, CylinderProps, CylinderArgs, useDistanceConstraint, SphereArgs, BodyProps, usePointToPointConstraint, PointToPointConstraintOpts, useHingeConstraint } from "@react-three/cannon";
import { Controls } from "../models";
import { Vector3, Mesh } from "three";
import { useEffect, MutableRefObject, useState } from "react";

const width = 0.5;
const height = 1.9;
const bodyLength = height-width*2;
const feetX = width/2;
const bodyX = (bodyLength)/2+feetX;
const headX = bodyX+bodyLength/2+width;

const Body = forwardRef<Mesh, CylinderProps>((props, fwdRef) => {
    const args: CylinderArgs = [
        width/2, // radiusTop
        width/2, // radiusBottom
        height-width*2, // height
        24, // radialSegments
    ]
    const [ref, api] = useCylinder(
      () => ({
        args,
        mass: 10,
        fixedRotation: true,
        material:{
          friction: 0,
          restitution: 0,
        },
        ...props,
      }),
      fwdRef,
    )

    return (
      <mesh ref={ref}>
        <cylinderGeometry args={args} />
        <meshStandardMaterial />
      </mesh>
    )
  })

  const Feet = forwardRef<Mesh, SphereProps>((props, fwdRef) => {
    const args: SphereArgs = [width/2-0.03]
    const [ref, api] = useSphere(
      () => ({
        args,
        mass: 90,
        material:{
          friction: 1,
          restitution: 0,
        },
        ...props,
      }),
      fwdRef,
    )
    const [normalMap, _url] = useNormalTexture(17, {
      offset: [0, 0],
      repeat: [5, 5],
    });

    useFrame(() => {
      api.angularVelocity.set(-1, 0, 0)
    }
    )
    return (
      <mesh ref={ref}>
        <sphereGeometry args={args} />
        <meshStandardMaterial
        color="lightblue"
        metalness={0.1}
        roughness={0.5}
        normalMap={normalMap}
      />
      </mesh>
    )
  })

  const Player = () => {
    const [body,feet] = useHingeConstraint(useRef<Mesh>(null), useRef<Mesh>(null), {
      pivotA: [0,-width,0],
      axisA: [1,0,0],
      collideConnected: false,
    })

    return (
      <>
        <OrbitControls />
        <Feet ref={feet} position={[0, feetX, 0]} />
        <Body ref={body} position={[0, bodyX, 0]} />
      </>
    )
  }

  export default Player;