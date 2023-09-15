import { usePlane, PlaneProps } from "@react-three/cannon";

const Floor = (props: PlaneProps) => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    material: {
      friction: 0.5,
    },
    ...props,
  })) as any;
  return (
    <mesh ref={ref} receiveShadow name="floor">
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="lightblue" metalness={0.1} roughness={0.5} />
    </mesh>
  );
};

export default Floor;
