import { css, keyframes } from '@emotion/core';
import { normalizeUnit } from '../utils/cssUtil';

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
  duration(duration: string | number = 300) {
    return css({
      animationDuration: normalizeUnit(duration, 'ms'),
      animationTimingFunction: 'ease',
    });
  },
  containerShow: css({
    animationName: containerShow,
  }),
  containerHide: css({
    animationName: containerHide,
  }),
  pullUpShow: css({
    animationName: pullUpShow,
  }),
  pullUpHide: css({
    animationName: pullUpHide,
  }),
  pullDownShow: css({
    animationName: pullDownShow,
  }),
  pullDownHide: css({
    animationName: pullDownHide,
  }),
  pullLeftShow: css({
    animationName: pullLeftShow,
  }),
  pullLeftHide: css({
    animationName: pullLeftHide,
  }),
  pullRightShow: css({
    animationName: pullRightShow,
  }),
  pullRightHide: css({
    animationName: pullRightHide,
  }),
  dialogShow: css({
    animationName: dialogShow,
  }),
  dialogHide: css({
    animationName: dialogHide,
  }),
  pullUp: css({
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
  }),
  pullDown: css({
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
  }),
  pullLeft: css({
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%',
  }),
  pullRight: css({
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
  }),
};
