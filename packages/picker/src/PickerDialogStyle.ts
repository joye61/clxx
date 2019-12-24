import { css } from "@emotion/core";
import { vw } from "@clxx/base";

export const style = {
  container: css({
    userSelect: "none",
    backgroundColor: "#fff",
    width: "100%",
    overflow: "hidden",
    boxShadow: `0 -1px 5px 0px #00000022`,
    borderTopLeftRadius: vw(10),
    borderTopRightRadius: vw(10),
    "@media (min-width: 576px)": {
      borderTopLeftRadius: vw(10, true),
      borderTopRightRadius: vw(10, true)
    }
  }),
  item: css({
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    padding: 0,
    color: "#000",
    fontSize: vw(18),
    "@media (min-width: 576px)": {
      fontSize: vw(18, true),
    }
  }),
  resultBox: css({
    height: "100%"
  }),
  hint: css({
    color: "gray",
    fontSize: vw(10),
    "@media (min-width: 576px)": {
      fontSize: vw(10, true),
    }
  }),
  result: css({
    color: "#000",
    fontSize: vw(16),
    whiteSpace: "nowrap",    
    "@media (min-width: 576px)": {
      fontSize: vw(16, true),
    }
  })
};
