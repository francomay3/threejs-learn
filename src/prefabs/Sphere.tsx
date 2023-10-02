import { useSphere, PublicApi, SphereProps } from "@react-three/cannon";
import { forwardRef, useImperativeHandle } from "react";

const Sphere = forwardRef(({ material = "Box", ...rest }: SphereProps, ref) => {
  const [physicsRef, api] = useSphere(() => ({
    material,
    ...rest,
  })) as [any, PublicApi];
  useImperativeHandle(ref, () => ({ ...api } as PublicApi));

  return (
    <mesh ref={physicsRef} castShadow receiveShadow>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
});

export default Sphere;
