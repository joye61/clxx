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
  image: css({
    width: "100%",
    height: "100%"
  }),
  imageFadeIn: css({
    animation: `${imageShow} 400ms ease-in`
  })
};
