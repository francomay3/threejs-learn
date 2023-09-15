import { useSphere, PublicApi, SphereProps } from "@react-three/cannon";
import { forwardRef, useImperativeHandle } from "react";

const Sphere = forwardRef((props: SphereProps, ref) => {
  console.log("Sphere props", props);
  const [physicsRef, api] = useSphere(() => ({
    ...props,
  })) as [any, PublicApi];
  useImperativeHandle(ref, () => ({ ...api } as PublicApi));

  return (
    <mesh key={10} ref={physicsRef} castShadow receiveShadow>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
});

export default Sphere;
