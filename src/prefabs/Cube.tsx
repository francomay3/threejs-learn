import {
    useBox,
    BoxProps,
  } from "@react-three/cannon";

const Cube = (props: BoxProps) => {
  const [ref] = useBox(() => ({ ...props })) as any;
  return (
    <mesh ref={ref} castShadow receiveShadow name="cube">
      <boxGeometry />
      <meshStandardMaterial color="red"></meshStandardMaterial>
    </mesh>
  );
};

export default Cube;