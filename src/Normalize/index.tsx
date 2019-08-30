/** @jsx jsx */
import { jsx, Global, css } from "@emotion/core";
import { AdaptiveOption } from "../cssUtil";
import { is } from "../is";

/**
 * 适用于移动端的全局自适应组件，推荐使用
 * @param props AdaptiveOption
 */
export function Normalize(props: AdaptiveOption) {
  const designWidth = is.number(props.designWidth) ? props.designWidth : 375;
  const criticalWidth = is.number(props.criticalWidth)
    ? props.criticalWidth
    : 576;

  return (
    <Global
      styles={css`
        * {
          box-sizing: border-box;
        }
        html {
          -webkit-tap-highlight-color: transparent;
          -webkit-overflow-scrolling: touch;
          -webkit-text-size-adjust: 100%;
          font-size: ${(100 * 100) / designWidth}vw;
        }
        body {
          font-size: initial;
          margin: 0 auto;
          max-width: ${criticalWidth}px;
        }
        @media screen and (min-width: ${criticalWidth}px) {
          html {
            font-size: ${(100 * criticalWidth) / designWidth}px;
          }
        }
      `}
    />
  );
}
