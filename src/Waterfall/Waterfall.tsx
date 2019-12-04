/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useRef } from "react";
import { WfHandler } from "./WfHandler";
import { useEffectOnce } from "../Effect/useEffectOnce";
import { is } from "../../es5";

export interface WaterfallProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  /**
   * 瀑布流每条间隙的宽度
   */
  gap?: number | string;
  /**
   * 瀑布流的列数
   */
  cols?: number;
  /**
   * 瀑布流容器准备就绪时触发
   */
  onReady?: (handler: WfHandler) => void;
}

export function Waterfall(props: WaterfallProps) {
  const { gap = 10, cols = 2, onReady = () => {}, ...attributes } = props;

  const container = useRef<HTMLDivElement>(null);

  const showCols = () => {
    const list: React.ReactNode[] = [];
    for (let i = 0; i < cols; i++) {
      list.push(
        <div
          css={{
            flexGrow: 1,
            flexShrink: 0,
            marginLeft: gap,
            marginTop: gap,
            marginBottom: gap,
            "&:last-child": {
              marginRight: gap
            },
            "& > div": {
              marginBottom: gap
            },
            "& > div:last-child": {
              marginBottom: 0
            }
          }}
          key={i}
        />
      );
    }
    return list;
  };

  useEffectOnce(() => {
    /**
     * 获取瀑布流的每一条流
     */
    const colsList: Array<HTMLElement> = [];
    for (let i = 0; i < container.current!.children.length; i++) {
      const child = container.current!.children.item(i);
      if (child!.tagName.toLowerCase() === "div") {
        colsList.push(child as HTMLElement);
      }
    }

    // 瀑布流容器准备就绪，将瀑布流处理实例传递给外部
    is.function(onReady) && onReady(new WfHandler(colsList));
  });

  return (
    <div
      css={{
        display: "flex",
        alignItems: "flex-start"
      }}
      {...attributes}
      ref={container}
    >
      {showCols()}
    </div>
  );
}
