import { FabricObjectProps } from "fabric";

export function getRandomColor() {
  const letters = "01234567890ABCDEF";
  return (
    "#" +
    Array(6)
      .keys()
      .reduce(
        (a, _) => a + letters[Math.floor(Math.random() * letters.length)],
        ""
      )
  );
}

export const getDefaultProps = (): Partial<FabricObjectProps> => {
  return {
    top: 50,
    left: 50,
    fill: getRandomColor(),
    centeredRotation: true,
  };
};
