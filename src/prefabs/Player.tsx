import { useFrame, useThree } from "@react-three/fiber";
import {
  useKeyboardControls,
  PointerLockControls,
} from "@react-three/drei";
import { useRef } from "react";
import { PublicApi, useCompoundBody } from "@react-three/cannon";
import { Controls } from "../models";
import {
  Vector3,
  Mesh,
} from "three";
import { useEffect, MutableRefObject } from "react";

const Player = () => {
  const grounded = useRef(0);
  const position = useRef(new Vector3());
  const velocity = useRef(new Vector3());
  const { camera } = useThree();


  const [collissionMesh, playerPhysicsApi] = useCompoundBody(() => ({
    mass: 80,
    shapes: [
      { args: [0.3], position: [0, 1.5, 0], type: "Sphere" },
      { args: [0.3], position: [0, 0.9, 0], type: "Sphere" },
      { args: [0.3], position: [0, 0.3, 0], type: "Sphere" },
    ],
    onCollide: (e) => {
      if (e.contact.impactVelocity > 50) {
        console.log("player died. or received damage.");
      }
    },
    onCollideBegin: () => (grounded.current += 1),
    onCollideEnd: () => (grounded.current -= 1),
    fixedRotation: true,
    position: [0, 1, 0],
    material: "slippery",
  })) as [MutableRefObject<Mesh>, PublicApi];
  const forward = useKeyboardControls<Controls>((state) => state.forward)
    ? 1
    : 0;
  const back = useKeyboardControls<Controls>((state) => state.back) ? 1 : 0;
  const left = useKeyboardControls<Controls>((state) => state.left) ? 1 : 0;
  const right = useKeyboardControls<Controls>((state) => state.right) ? 1 : 0;

  useEffect(() => {
    if (!playerPhysicsApi) return;

    playerPhysicsApi.position.subscribe((playerPosition) => {
      const x = playerPosition[0];
      const y = playerPosition[1];
      const z = playerPosition[2];
      camera.position.copy(new Vector3(x, y + 2, z));
      position.current = new Vector3(x, y, z);
    });
    playerPhysicsApi.velocity.subscribe((pVelocity) => {
      const x = pVelocity[0];
      const y = pVelocity[1];
      const z = pVelocity[2];
      velocity.current = new Vector3(x, y, z);
    });
  }, [playerPhysicsApi]);

  useFrame((_props, delta) => {
    if (!playerPhysicsApi || !camera) return;

    const speed = 700 * delta;
    const x = (right - left);
    const y = 0;
    const z = (back - forward);

    const direction = new Vector3(x, y, z).applyQuaternion(camera.quaternion).setY(0).normalize().multiplyScalar(speed);


    // check if there is input and the player is grounded, else let physics handle movement
    if (direction.length() !== 0 && grounded.current > 0) {
      playerPhysicsApi.velocity.set(
        direction.x,
        velocity.current.y,
        direction.z
      );
    }
  });

  return (
    <group name="player">
      <PointerLockControls />
      <mesh ref={collissionMesh} castShadow receiveShadow name="player">
        <capsuleGeometry args={[0.3, 1.3, 2, 10]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </group>
  );
};

export default Player;
