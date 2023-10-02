import { useBox, BoxProps } from "@react-three/cannon";

const Cube = ({
  args = [
    1, // width
    1, // height
    1, // depth
  ],
  material = "Box",
  ...rest
}: BoxProps) => {
  const [ref] = useBox(() => ({
    args,
    material,
    ...rest,
  })) as any;
  return (
    <mesh ref={ref} castShadow receiveShadow name="cube">
      <boxGeometry args={args} />
      <meshStandardMaterial color="red"></meshStandardMaterial>
    </mesh>
  );
};

export default Cube;
