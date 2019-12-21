import { css, keyframes } from "@emotion/core";

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
const pullupShow = keyframes`
	from {
		transform: translateY(100%);
	}
	to {
		transform: translateY(0);
	}
`;
const pullupHide = keyframes`
	from {
		transform: translateY(0);
	}
	to {
		transform: translateY(100%);
	}
`;
const dialogShow = keyframes`
	from  {
		transform: scale(0.8);
		opacity: 0;
	}
	to {
		transform: scale(1);
		opacity: 1;
	}
`;
const dialogHide = keyframes`
	from  {
		transform: scale(1);
		opacity: 1;
	}
	to {
		transform: scale(0.8);
		opacity: 0;
	}
`;

export const style = {
  duration: css({
		animationDuration: "200ms",
		animationTimingFunction: "ease"
  }),
  containerShow: css({
    animationName: containerShow
  }),
  containerHide: css({
    animationName: containerHide
  }),
  pullupShow: css({
    animationName: pullupShow
  }),
  pullupHide: css({
    animationName: pullupHide
  }),
  dialogShow: css({
    animationName: dialogShow
  }),
  dialogHide: css({
    animationName: dialogHide
  }),
  pullUp: css({
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%"
  })
};
