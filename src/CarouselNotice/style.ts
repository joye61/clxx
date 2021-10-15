import { Interpolation, keyframes, Theme } from "@emotion/react";
import { adaptive } from "../utils/cssUtil";

export const Bubble = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-50%);
  }
`;

export const style: Record<string, Interpolation<Theme>> = {
  box: [
    {
      position: "relative",
      overflow: "hidden",
      transition: "all 200ms",
    },
    adaptive({
      height: 80,
    }),
  ],
  wrapper: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "200%",
  },
  item: {
    width: "100%",
    height: "50%",
    display: "flex",
    alignItems: "center",
    fontSize: "initial",
  },
};
