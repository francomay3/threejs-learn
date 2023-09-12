import {
  Physics,
  usePlane,
  useBox,
  useSphere,
  PublicApi,
  Triplet,
} from "@react-three/cannon";
import {
  PerspectiveCamera,
  Environment,
  PointerLockControls,
  Stats,
  useKeyboardControls,
} from "@react-three/drei";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Controls } from "../models";

type Position = [number, number, number];

const Plane = () => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] })) as any;
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="lightblue" metalness={0.1} roughness={0.5} />
    </mesh>
  );
};

const Cube = ({ position }: { position: Position }) => {
  const [ref] = useBox(() => ({ mass: 1, position })) as any;
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

const Sphere = forwardRef(({ position }: { position: Position }, ref) => {
  const [physicsRef, api] = useSphere(() => ({ mass: 1, position })) as [
    any,
    PublicApi
  ];
  useImperativeHandle(ref, () => ({ ...api } as PublicApi));

  return (
    <mesh key={10} ref={physicsRef} castShadow receiveShadow>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
});

const Scene = () => {
  const sphereRef = useRef<PublicApi>();
  const forward = useKeyboardControls<Controls>((state) => state.forward);
  const back = useKeyboardControls<Controls>((state) => state.back);
  const left = useKeyboardControls<Controls>((state) => state.left);
  const right = useKeyboardControls<Controls>((state) => state.right);

  useFrame(() => {
    const sphere = sphereRef.current;
    if (!sphere) return;

    const force = 5;
    const direction = [0, 0, 0];
    if (forward) direction[2] = -1;
    if (back) direction[2] = 1;
    if (left) direction[0] = -1;
    if (right) direction[0] = 1;

    sphere.applyForce(direction.map((v) => v * force) as Triplet, [0, 0, 0]);
  });

  return (
    <>
      <Environment preset="forest" background />
      <PerspectiveCamera
        makeDefault
        position={[5, 2, 5]}
        rotation={[0, 0.5, 0]}
      />
      <PointerLockControls />
      <Stats />
      <Physics>
        <Plane />
        <Sphere position={[0, 5, 0.2]} ref={sphereRef} />
        <Sphere position={[0, 10, 0.2]} />
        <Cube position={[0, 7, 0]} />
      </Physics>
    </>
  );
};

export default Scene;
