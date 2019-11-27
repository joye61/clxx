import { css, keyframes } from "@emotion/core";

const imageShow = keyframes`
  from{
    opacity: 0;
  }
  to{
    opacity: 1;
  }
`;

export const styles = {
  container: css({
    position: "relative",
    overflow: "hidden",
    fontSize: 0
  }),
  placeholder: css({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#f5f5f5"
  }),
  image: css({
    width: "100%",
    height: "100%",
    animation: `${imageShow} 500ms ease-in`
  })
};
