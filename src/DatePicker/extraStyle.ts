import css from "@emotion/css";
import { vw } from "../cssUtil";
import { itemHeight } from "./style";

export const style = {
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
      // backgroundColor: "#000",
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
  }),
  text: css({
    position: "absolute",
    top: "50%",
    right: vw(10),
    color: "#007bff",
    userSelect: "none",
    fontSize: vw(12),
    transform: "translateY(-50%)"
  })
};
