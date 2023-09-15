import { useFrame } from "@react-three/fiber";
import {
  useKeyboardControls,
  PerspectiveCamera,
  PointerLockControls,
} from "@react-three/drei";
import { useRef } from "react";
import { PublicApi, useBox } from "@react-three/cannon";
import { Controls } from "../models";
import {
  PerspectiveCamera as PerspectiveCameraType,
  Vector3,
  Mesh,
  Euler,
} from "three";
import { useEffect, MutableRefObject } from "react";
import Raycast from "../components/Raycast";

const Player = () => {
  const grounded = useRef(true);
  const directionVector = useRef(new Vector3());
  const position = useRef(new Vector3());
  const velocity = useRef(new Vector3());

  const [collissionMesh, playerPhysicsApi] = useBox(() => ({
    mass: 0.1,
    fixedRotation: true,
    material: {
      friction: 0.05,
    },
  })) as [MutableRefObject<Mesh>, PublicApi];
  const cameraRef = useRef<PerspectiveCameraType>(null);
  const forward = useKeyboardControls<Controls>((state) => state.forward)
    ? 1
    : 0;
  const back = useKeyboardControls<Controls>((state) => state.back) ? 1 : 0;
  const left = useKeyboardControls<Controls>((state) => state.left) ? 1 : 0;
  const right = useKeyboardControls<Controls>((state) => state.right) ? 1 : 0;

  useEffect(() => {
    const camera = cameraRef.current;
    if (!playerPhysicsApi || !camera) return;

    // the angle on the Y axis will be used to rotate the player, so to avoid possible distortions we need to measure it first.
    camera.rotation.reorder("YXZ");
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
  }, [playerPhysicsApi, cameraRef]);

  useFrame(() => {
    const camera = cameraRef.current;
    if (!playerPhysicsApi || !camera) return;

    const cameraRotation = camera.rotation.y;
    // up and down given by the angle in x
    // left and right given by the angle in y
    // point the player in the direction of the camera
    playerPhysicsApi.rotation.set(0, cameraRotation, 0);

    const speed = 10;
    const x = (right - left) * speed;
    const y = 0;
    const z = (back - forward) * speed;

    directionVector.current = new Vector3(x, y, z).applyEuler(
      new Euler(0, cameraRotation, 0)
    );

    // check if there is input and the player is grounded, else let physics handle movement
    if (directionVector.current.length() !== 0 && grounded.current) {
      playerPhysicsApi.velocity.set(
        directionVector.current.x,
        velocity.current.y,
        directionVector.current.z
      );
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault ref={cameraRef} />
      <PointerLockControls />

      <mesh ref={collissionMesh} castShadow receiveShadow name="player">
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      <Raycast
        from={[5, 0.1, 0.1]}
        to={[5, 1.5, 0.1]}
        onHit={(e) => {
          console.log(e);
        }}
      />
    </>
  );
};

export default Player;
