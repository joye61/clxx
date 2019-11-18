import { css, keyframes } from "@emotion/core";
import { vw, vwWithMediaQuery } from "../cssUtil";

export const barNum = 6;

export const wave = keyframes`
0%, 40%, 100% {
  transform: scaleY(1);
  opacity: .3;
}

20% {
  transform: scaleY(2);
  opacity: 1;
}
`;

const duration = 800;

export const style: any = {
  container: css`
    font-size: 0;
  `,
  item: css({
    display: "inline-block",
    backgroundColor: "#fff",
    animation: `${wave} ${duration}ms ease-in-out infinite`,
    ...vwWithMediaQuery(
      {
        width: vw(2),
        height: vw(12),
        marginRight: vw(4)
      },
      {
        width: "2px",
        height: "12px",
        marginRight: "4px"
      }
    )
  })
};

for (let i = 0; i < barNum; i++) {
  style[`bar-${i}`] = css({
    animationDelay: `${i * 100 - duration}ms`
  });
}
