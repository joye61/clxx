import { Interpolation, keyframes, Theme } from "@emotion/react";
import { adaptive } from "../utils/cssUtil";

export const LoadingShow = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
export const LoadingHide = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export const style: Record<string, Interpolation<Theme>> = {
  boxCommon: adaptive({
    backgroundColor: `rgba(0, 0, 0, .8)`,
    borderRadius: 16,
  }),
  box: adaptive({
    width: 160,
    height: 160,
  }),
  boxShow: {
    animation: `${LoadingShow} 200ms`,
  },
  boxHide: {
    animation: `${LoadingHide} 200ms`,
  },
  boxWithExtra: [
    adaptive({ padding: 30 }),
    {
      "> div:first-of-type": adaptive({
        width: 48,
        height: 48,
      }),
    },
  ],
  hint: adaptive({
    color: "#f5f5f5dd",
    whiteSpace: "nowrap",
    fontSize: 28,
    marginLeft: 20,
  }),
};
