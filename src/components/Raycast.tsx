import { Object3DNode, extend } from "@react-three/fiber";
import { useRaycastAll, Triplet } from "@react-three/cannon";
import { BufferGeometry, Line as ThreeLine, Vector3 } from "three";
import { useMemo } from "react";

extend({ ThreeLine });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      threeLine: Object3DNode<ThreeLine, typeof ThreeLine>;
    }
  }
}

type Props = {
  from: Triplet;
  to: Triplet;
  onHit: (result: {}) => void;
};

const Raycast = ({ from, to, onHit }: Props) => {
  useRaycastAll({ from, to }, onHit);
  const geometry = useMemo(() => {
    const points = [from, to].map((v) => new Vector3(...v));
    return new BufferGeometry().setFromPoints(points);
  }, []);
  return (
    <threeLine geometry={geometry}>
      <lineBasicMaterial color="black" />
    </threeLine>
  );
};

export default Raycast;
