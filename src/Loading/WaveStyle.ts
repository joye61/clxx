import { css, keyframes } from "@emotion/core";
import { vw } from "../cssUtil";

export const barNum = 6;

export const wave = keyframes`
0%, 40%, 100% {
  transform: scaleY(1);
  opacity: .3;
}

20% {
    transform: scaleY(1.8);
    opacity: 1;
}
`;

const duration = 800;

export const style: any = {
  container: css`
    font-size: 0;
  `,
  item(barColor: string = "#000") {
    return css`
      display: inline-block;
      width: ${vw(2)};
      height: ${vw(14)};
      margin-right: ${vw(4)};
      @media screen and (min-width: 576px) {
        width: 2px;
        height: 14px;
        margin-right: 4px;
      }
      background-color: ${barColor};
      animation: ${wave} ${duration}ms ease-in-out infinite;
    `;
  }
};

for (let i = 0; i < barNum; i++) {
  style[`bar-${i}`] = css`
    animation-delay: ${i * 100 - duration}ms;
  `;
}
