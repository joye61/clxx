import { css, keyframes } from "@emotion/react";
import { Keyframes } from "@emotion/serialize";

const maskShow = keyframes`
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
`;
export const maskHide = keyframes`
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
  const animation = {
    center: [centerShow, centerHide],
    pullUp: [pullUpShow, pullUpHide],
    pullDown: [pullDownShow, pullDownHide],
    pullLeft: [pullLeftShow, pullLeftHide],
    pullRight: [pullRightShow, pullRightHide],
  };

  let keyframes: Keyframes;
  if (status === "show") {
    keyframes = animation[type][0];
  } else {
    keyframes = animation[type][1];
  }

  return {
    keyframes,
    animation: css({
      animation: `${keyframes} 300ms ease`,
    }),
  };
}

export const style = {
  maskShow: css({
    animation: `${maskShow} 300ms ease`,
  }),
  maskHide: css({
    animation: `${maskHide} 300ms ease`,
  }),
  mask: css({
    zIndex: 1,
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  }),
  boxCss: css({
    zIndex: 2,
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
