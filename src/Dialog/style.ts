import { css, keyframes } from "@emotion/react";
import { Keyframes } from "@emotion/serialize";

const containerShow = keyframes`
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
`;
export const containerHide = keyframes`
	from {
		opacity: 1;
	}
	to {
		opacity: 0;
	}
`;
const pullUpShow = keyframes`
	from {
		transform: translateY(100%);
	}
	to {
		transform: translateY(0);
	}
`;
const pullUpHide = keyframes`
	from {
		transform: translateY(0);
	}
	to {
		transform: translateY(100%);
	}
`;
const pullDownShow = keyframes`
	from {
		transform: translateY(-100%);
	}
	to {
		transform: translateY(0);
	}
`;
const pullDownHide = keyframes`
	from {
		transform: translateY(0);
	}
	to {
		transform: translateY(-100%);
	}
`;
const pullLeftShow = keyframes`
	from {
		transform: translateX(100%);
	}
	to {
		transform: translateX(0);
	}
`;
const pullLeftHide = keyframes`
	from {
		transform: translateX(0);
	}
	to {
		transform: translateX(100%);
	}
`;
const pullRightShow = keyframes`
	from {
		transform: translateX(-100%);
	}
	to {
		transform: translateX(0);
	}
`;
const pullRightHide = keyframes`
	from {
		transform: translateX(0);
	}
	to {
		transform: translateX(-100%);
	}
`;
const centerShow = keyframes`
	from  {
		transform: scale(0.8);
		opacity: 0;
	}
	to {
		transform: scale(1);
		opacity: 1;
	}
`;
const centerHide = keyframes`
	from  {
		transform: scale(1);
		opacity: 1;
	}
	to {
		transform: scale(0.8);
		opacity: 0;
	}
`;

export type DialogType =
  | "center"
  | "pullUp"
  | "pullDown"
  | "pullLeft"
  | "pullRight";

export type AnimationStatus = "show" | "hide";

export function getAnimation(type: DialogType, status: AnimationStatus) {
  const showAnimation = {
    center: centerShow,
    pullUp: pullUpShow,
    pullDown: pullDownShow,
    pullLeft: pullLeftShow,
    pullRight: pullRightShow,
  };
  const hideAnimation = {
    center: centerHide,
    pullUp: pullUpHide,
    pullDown: pullDownHide,
    pullLeft: pullLeftHide,
    pullRight: pullRightHide,
  };

  let keyframes: Keyframes;
  if (status === "show") {
    keyframes = showAnimation[type];
  } else {
    keyframes = hideAnimation[type];
  }

  return {
    keyframes,
    animation: css({
      animation: `${keyframes} 200ms`,
    }),
  };
}

export const style = {
  containerShow: css({
    animation: `${containerShow} 200ms`,
  }),
  containerHide: css({
    animation: `${containerHide} 200ms`,
  }),
  pullUp: css({
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
  }),
  pullDown: css({
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
  }),
  pullLeft: css({
    position: "absolute",
    right: 0,
    top: 0,
    height: "100%",
  }),
  pullRight: css({
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
  }),
};
