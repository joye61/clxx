/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useRef } from "react";
import { useEffectOnce } from "../Effect/useEffectOnce";
import { splitValue } from "../cssUtil";

export interface WfContainerOption
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
  onReady?: (columns: Array<HTMLElement>) => void;
}

export function WfContainer(props: WfContainerOption) {
  const { gap = 10, cols = 2, onReady = () => {}, ...attributes } = props;

  const container = useRef<HTMLDivElement>(null);

  const showCols = () => {
    const list: React.ReactNode[] = [];
    const {num, unit} = splitValue(gap);
    for (let i = 0; i < cols; i++) {
      list.push(
        <div
          css={{
            flexGrow: 1,
            flexShrink: 0,
            boxSizing: "border-box",
            width: `${100 / cols}%`,
            marginTop: gap,
            marginBottom: gap,
            paddingLeft: num/2 + unit,
            paddingRight: num/2 + unit,
            overflow: "hidden",
            "&:first-of-type": {
              paddingLeft: gap,
            },
            "&:last-of-type": {
              paddingRight: gap
            },
            "& > div": {
              marginBottom: gap
            },
            "& > div:last-of-type": {
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
    const columns: Array<HTMLElement> = [];
    for (let i = 0; i < container.current!.children.length; i++) {
      const child = container.current!.children.item(i);
      if (child!.tagName.toLowerCase() === "div") {
        columns.push(child as HTMLElement);
      }
    }

    // 瀑布流容器准备就绪，将瀑布流处理实例传递给外部
    typeof onReady === "function" && onReady(columns);
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
