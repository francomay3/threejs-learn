import styled from "styled-components";

const UiWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const CenterPoint = styled.div`
  position: absolute;
  width: 5px;
  aspect-ratio: 1/1;
  border: 1px solid white;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

const Ui = ({ children: canvas }: { children: JSX.Element }) => {
  return (
    <UiWrapper>
      <CenterPoint />
      {canvas}
    </UiWrapper>
  );
};

export default Ui;
