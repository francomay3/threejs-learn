import { useFrame, useThree } from "@react-three/fiber";
import {
  useKeyboardControls,
  PointerLockControls,
  GizmoHelper,
  GizmoViewport,
} from "@react-three/drei";
import { useRef } from "react";
import { PublicApi, Triplet, useSphere } from "@react-three/cannon";
import { Controls } from "../models";
import { Vector3, Mesh } from "three";
import { useEffect, MutableRefObject, useState } from "react";

const useInput = () => {
  const forward = useKeyboardControls<Controls>((state) => state.forward)
    ? 1
    : 0;
  const back = useKeyboardControls<Controls>((state) => state.back) ? 1 : 0;
  const left = useKeyboardControls<Controls>((state) => state.left) ? 1 : 0;
  const right = useKeyboardControls<Controls>((state) => state.right) ? 1 : 0;
  const jump = useKeyboardControls<Controls>((state) => state.jump);
  const [relativeMovementAngle, setRelativeMovementAngle] = useState(0);
  const [hasInput, setHasInput] = useState(false);

  useEffect(() => {
    const z = left - right;
    const x = back - forward;

    if (x !== 0 || z !== 0) {
      const angle = Math.atan2(x, z);
      setRelativeMovementAngle(angle);
      setHasInput(true);
    } else {
      setRelativeMovementAngle(0);
      setHasInput(false);
    }
  }, [forward, back, left, right]);

  return {
    forward,
    back,
    left,
    right,
    jump,
    hasInput,
    relativeMovementAngle,
  };
};

const useAttachCamera = (
  playerPhysicsApi: PublicApi | undefined,
  camera: THREE.Camera | undefined,
  position: MutableRefObject<Vector3>,
  velocity: MutableRefObject<Vector3>
) => {
  useEffect(() => {
    if (!playerPhysicsApi || !camera) return;

    camera.rotation.order = "YXZ";

    playerPhysicsApi.position.subscribe((playerPosition) => {
      const x = playerPosition[0];
      const y = playerPosition[1];
      const z = playerPosition[2];
      camera.position.set(x, y + 2, z);
      position.current = new Vector3(x, y, z);
    });
    playerPhysicsApi.velocity.subscribe((pVelocity) => {
      const x = pVelocity[0];
      const y = pVelocity[1];
      const z = pVelocity[2];
      velocity.current = new Vector3(x, y, z);
    });
  }, [playerPhysicsApi, camera]);
};

const useJump = (
  jump: boolean,
  grounded: number,
  playerPhysicsApi: PublicApi | undefined,
  velocity: MutableRefObject<Vector3>,
  jumpForce: number
) => {
  useEffect(() => {
    if (!playerPhysicsApi) return;
    if (jump && grounded > 0) {
      playerPhysicsApi.velocity.set(
        velocity.current.x,
        velocity.current.y + jumpForce,
        velocity.current.z
      );
    }
  }, [jump, playerPhysicsApi]);
};

const useMovePlayer = (
  playerPhysicsApi: PublicApi | undefined,
  camera: THREE.Camera | undefined,
  hasInput: boolean,
  relativeMovementAngle: number,
  speed: number
) => {
  useFrame((_state, delta) => {
    if (!playerPhysicsApi || !camera) return;

    if (!hasInput) {
      playerPhysicsApi.angularVelocity.set(0, 0, 0);
      return;
    }

    const angleYcameraDirection = camera.rotation.y;
    const worldMovementAngle = relativeMovementAngle + angleYcameraDirection;
    const deltaSpeed = speed * delta;

    const x = Math.sin(worldMovementAngle) * deltaSpeed;
    const z = Math.cos(worldMovementAngle) * deltaSpeed;

    playerPhysicsApi.rotation.set(0, angleYcameraDirection, 0);
    playerPhysicsApi.angularVelocity.set(x, 0, z);
  });
};

const useCameraShake = (
  hasInput: boolean,
  camera: THREE.Camera | undefined
) => {
  useFrame((state) => {
    if (!hasInput || !camera) return;
    const t = state.clock.getElapsedTime();
    camera.position.y += Math.sin(t * 10) * 0.02;
  });
};

const Player = ({ position: startingPosition }: { position: Triplet }) => {
  const playerWidth = 0.5;
  const [grounded, setGrounded] = useState(0);
  const position = useRef(new Vector3());
  const velocity = useRef(new Vector3());
  const { camera } = useThree();
  const { hasInput, relativeMovementAngle, jump } = useInput();
  const speed = 1000;
  const jumpForce = 5;
  const playerMass = 80;

  const [collissionMesh, playerPhysicsApi] = useSphere(() => ({
    mass: playerMass,
    position: startingPosition,
    args: [playerWidth / 2],
    onCollide: (e) => {
      if (e.contact.impactVelocity > 50) {
        console.log("player died. or received damage.");
      }
    },
    onCollideBegin: () => setGrounded((grounded) => grounded + 1),
    onCollideEnd: () => setGrounded((grounded) => grounded - 1),
    material: "slippery",
  })) as [MutableRefObject<Mesh>, PublicApi];

  useJump(jump, grounded, playerPhysicsApi, velocity, jumpForce);
  useAttachCamera(playerPhysicsApi, camera, position, velocity);
  useCameraShake(hasInput, camera);
  useMovePlayer(
    playerPhysicsApi,
    camera,
    hasInput,
    relativeMovementAngle,
    speed
  );

  return (
    <group name="player">
      <GizmoHelper>
        <GizmoViewport
          axisColors={["red", "green", "blue"]}
          labelColor="black"
        />
      </GizmoHelper>
      <PointerLockControls />
      <mesh ref={collissionMesh} castShadow receiveShadow name="player">
        <sphereGeometry args={[playerWidth / 2, 32, 32]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </group>
  );
};

export default Player;
