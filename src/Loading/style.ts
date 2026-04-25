import { Interpolation, keyframes, Theme } from "@emotion/react";

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
    borderRadius: '.2rem',
    backdropFilter: 'blur(20px) saturate(160%)',
    WebkitBackdropFilter: 'blur(20px) saturate(160%)',
  },
  box: {
    width: '1.6rem',
    height: '1.6rem',
  },
  boxShow: {
    animation: `${LoadingShow} 200ms`,
  },
  boxHide: {
    animation: `${LoadingHide} 200ms`,
  },
  boxWithExtra: {
    padding: '.3rem',
  },
  hint: {
    color: "#ffffff",
    whiteSpace: "nowrap",
    fontSize: '.28rem',
    marginLeft: '.2rem',
    fontWeight: 500,
  },
};
