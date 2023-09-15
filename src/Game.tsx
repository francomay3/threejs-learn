import { Canvas } from "@react-three/fiber";
import {
  KeyboardControls,
  KeyboardControlsEntry,
  Stats,
} from "@react-three/drei";
import { useMemo } from "react";
import Scene from "./scenes/Playground";
import { Controls } from "./models";
import Ui from "./Ui";

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
      <Ui>
        <Canvas
          shadows
          gl={{ alpha: false }}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            pointerEvents: "auto",
            touchAction: "none",
          }}
        >
          <Stats />
          <Scene />
        </Canvas>
      </Ui>
    </KeyboardControls>
  );
}

export default App;
