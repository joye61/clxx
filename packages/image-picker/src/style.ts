import { css } from "@emotion/core";
import { vw } from "@clxx/base";

export const style = {
  pick: css({
    width: "100%",
    height: "100%",
    backgroundColor: `#f5f5f5`,
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    svg: {
      width: "40%"
    },
    span: css({
      fontSize: vw(12),
      marginTop: vw(3),
      "@media (min-width: 576px)": {
        fontSize: vw(12, true),
        marginTop: vw(3, true)
      }
    }),
    "input[type=file]": {
      display: "none"
    }
  }),
  canPick: css({
    boxShadow: `0 0 1px black`,
    svg: {
      path: {
        fill: "gray"
      }
    },
    span: css({
      color: "gray"
    }),
    "&:active": {
      opacity: 0.5
    }
  }),
  cantPick: css({
    boxShadow: `0 0 1px rgba(0,0,0,.5)`,
    svg: {
      path: {
        fill: "#ccc"
      }
    },
    span: css({
      color: "#ccc"
    })
  }),
  item: css({
    boxShadow: `0 0 1px black`,
    width: "100%",
    height: "100%",
    fontSize: 0,
    backgroundSize: "cover",
    overflow: "hidden",
    position: "relative"
  }),
  remove: css({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: `translate(-50%, -50%)`,
    backgroundColor: "rgba(0, 0, 0, .4)",
    width: '50%',
    height: "50%",
    borderRadius: "50%",
    svg: {
      width: "50%",
      path: {
        fill: "#fff"
      }
    },
    "&:active": {
      opacity: 0.5
    }
  })
};
