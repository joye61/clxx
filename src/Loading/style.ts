import { Interpolation, keyframes, Theme } from "@emotion/react";
import { r } from "../utils/rem";

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
  boxCommon: {
    backgroundColor: `rgba(0, 0, 0, .72)`,
    borderRadius: r(20),
    backdropFilter: 'blur(20px) saturate(160%)',
    WebkitBackdropFilter: 'blur(20px) saturate(160%)',
  },
  box: {
    width: r(160),
    height: r(160),
  },
  boxShow: {
    animation: `${LoadingShow} 200ms`,
  },
  boxHide: {
    animation: `${LoadingHide} 200ms`,
  },
  boxWithExtra: {
    padding: r(30),
  },
  hint: {
    color: "#ffffff",
    whiteSpace: "nowrap",
    fontSize: r(28),
    marginLeft: r(20),
    fontWeight: 500,
  },
};
