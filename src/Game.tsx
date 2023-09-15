import { Canvas } from "@react-three/fiber";
import {
  KeyboardControls,
  KeyboardControlsEntry,
  Stats,
} from "@react-three/drei";
import { useMemo } from "react";
import Scene from "./scene/Scene";
import { Controls } from "./models";

function App() {
  const map = useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
    ],
    []
  );

  return (
    <KeyboardControls map={map}>
      <Canvas shadows>
        <Stats />
        <Scene />
      </Canvas>
    </KeyboardControls>
  );
}

export default App;
