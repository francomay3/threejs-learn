import { usePlane, PlaneProps } from "@react-three/cannon";
import { useNormalTexture } from "@react-three/drei";

const Floor = ({ material = "Ground", ...rest }: PlaneProps) => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    material,
    ...rest,
  })) as any;

  const [normalMap, _url] = useNormalTexture(17, {
    offset: [0, 0],
    repeat: [100, 100],
  });

  return (
    <mesh ref={ref} receiveShadow name="floor">
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial
        color="lightblue"
        metalness={0.1}
        roughness={0.5}
        normalMap={normalMap}
      />
    </mesh>
  );
};

export default Floor;
