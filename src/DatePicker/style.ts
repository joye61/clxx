import { vw } from "../cssUtil";
import { keyframes, css } from "@emotion/core";

export const backgroundShow = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
export const backgroundHide = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export const containerUp = keyframes`
  from {
    transform: translate3d(0, 100%, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
`;
export const containerDown = keyframes`
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(0, 100%, 0);
  }
`;

/**
 * 滚动列表的每一项高度
 */
export const itemHeight = 46;

export const style = {
  backgroundShow: css({
    animation: `${backgroundShow} 400ms ease`
  }),
  backgroundHide: css({
    animation: `${backgroundHide} 400ms ease`
  }),
  container: css({
    userSelect: "none",
    backgroundColor: "#fff",
    width: "100%",
    overflow: "hidden",
    position: "absolute",
    left: 0,
    bottom: 0,
    borderTopLeftRadius: vw(10),
    borderTopRightRadius: vw(10),
    boxShadow: `0 -1px 5px 0px #00000022`
  }),
  containerUp: css({
    animation: `${containerUp} 400ms ease`
  }),
  containerDown: css({
    animation: `${containerDown} 400ms ease`
  }),
  swiperContainer: css({
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
    height: vw(itemHeight * 5),
    ".swiper-wrapper .swiper-slide": {
      height: vw(itemHeight)
    }
  }),
  swiperInnerContainer: css({
    width: "100%",
    height: "100%"
  }),
  btnGroup: css({
    position: "relative",
    backgroundColor: "#f5f6f7",
    "&::after": {
      display: "block",
      content: '""',
      position: "absolute",
      left: 0,
      bottom: 0,
      width: "100%",
      height: "1px",
      backgroundColor: "#6c757d82",
      transform: `scaleY(${1 / window.devicePixelRatio})`
    }
  }),
  btn: css({
    fontSize: vw(16),
    lineHeight: vw(itemHeight),
    padding: `0 ${vw(12)}`,
    letterSpacing: vw(1),
    "&.cancel": {
      color: "#6c757d"
    },
    "&.confirm": {
      color: "#007bff"
    }
  }),
  item: css({
    fontSize: vw(20),
    color: "#000",
    fontFamily: "Tahoma, Arial, Verdana, Tahoma",
    height: "100%",
    userSelect: "none"
  }),
  unit: css({
    position: "relative",
    top: vw(2),
    fontSize: vw(12),
    marginLeft: vw(2),
    color: "#999"
  })
};

export const maskStyle = {
  container: css({
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 2
  }),
  item: css({
    position: "relative"
  }),
  item1: css({
    height: vw(itemHeight * 2),
    backgroundColor: "#fff",
    maskImage: `linear-gradient(to top, transparent, rgba(255,255,255,.9), #fff)`
  }),
  item2: css({
    position: "relative",
    height: vw(itemHeight),
    backgroundColor: `rgba(0,0,0,.1)`,
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      left: 0,
      width: "100%",
      height: "1px",
      transform: `scaleY(${1 / window.devicePixelRatio})`
    },
    "&::before": {
      top: 0
    },
    "&::after": {
      bottom: 0
    }
  }),
  item3: css({
    height: vw(itemHeight * 2),
    backgroundColor: "#fff",
    maskImage: `linear-gradient(to bottom, transparent, rgba(255,255,255,.9), #fff)`
  })
};
