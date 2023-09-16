import { useFrame, useThree } from "@react-three/fiber";
import {
  useKeyboardControls,
  PointerLockControls,
  GizmoHelper,
  GizmoViewport,
} from "@react-three/drei";
import { useRef } from "react";
import { PublicApi, useCompoundBody } from "@react-three/cannon";
import { Controls } from "../models";
import {
  Vector3,
  Mesh,
} from "three";
import { useEffect, MutableRefObject, useState } from "react";

const useInput = () => {
  const forward = useKeyboardControls<Controls>((state) => state.forward)
    ? 1
    : 0;
  const back = useKeyboardControls<Controls>((state) => state.back) ? 1 : 0;
  const left = useKeyboardControls<Controls>((state) => state.left) ? 1 : 0;
  const right = useKeyboardControls<Controls>((state) => state.right) ? 1 : 0;
  const [vector, setVector] = useState(new Vector3());
  const [hasInput, setHasInput] = useState(false);

  useEffect(() => {
    setVector(new Vector3((right - left), 0, (back - forward)));

    if (forward || back || left || right) {
      setHasInput(true);
    } else {
      setHasInput(false);
    }
  }, [forward, back, left, right]);

  return {
    forward,
    back,
    left,
    right,
    hasInput,
    vector
  };
}

const Player = () => {
  const dampingFactor = 0.999999;
  const [grounded, setGrounded] = useState(0);
  const position = useRef(new Vector3());
  const velocity = useRef(new Vector3());
  const { camera } = useThree();
  const { hasInput, vector } = useInput();

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
    onCollideBegin: () => (setGrounded((grounded) => grounded + 1)),
    onCollideEnd: () => (setGrounded((grounded) => grounded - 1)),
    fixedRotation: true,
    position: [0, 1, 0],
    material: {
      friction: 0
    },
  })) as [MutableRefObject<Mesh>, PublicApi];

  useEffect(() => {
    if (hasInput || !grounded){
      playerPhysicsApi.linearDamping.set(0);
      return
    }
    playerPhysicsApi.linearDamping.set(dampingFactor);
  }
  , [hasInput, grounded, playerPhysicsApi]);

  useEffect(() => {
    if (!playerPhysicsApi || !camera || !collissionMesh) return;

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

  useFrame((_props, delta) => {
    if (!playerPhysicsApi || !camera) return;

    
    // check if there is input and the player is grounded, else let physics handle movement
    if (hasInput && grounded > 0) {
      playerPhysicsApi.velocity.set(0, 0, 0);
      const angleYcameraDirection = camera.rotation.y;
      playerPhysicsApi.rotation.set(0, angleYcameraDirection, 0);

      const speed = 40000 * delta;
      const direction = vector.clone().setLength(speed);

      playerPhysicsApi.applyLocalImpulse(direction.toArray(), [0, 0, 0]);
    }
  });

  return (
    <group name="player">
      <GizmoHelper>
        <GizmoViewport axisColors={["red", "green", "blue"]} labelColor="black" />
      </GizmoHelper>
      <PointerLockControls />
      <mesh ref={collissionMesh} castShadow receiveShadow name="player">
        <capsuleGeometry args={[0.3, 1.3, 2, 10]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </group>
  );
};

export default Player;
