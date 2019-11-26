/** @jsx jsx */
import { jsx, SerializedStyles } from "@emotion/core";
import { style } from "./style";
import { useState } from "react";
import { useInterval } from "../Effect/useInterval";

export interface RollingNoticeProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  list?: Array<React.ReactNode>;
  height?: string | number;
  fontSize?: string | number;
  duration?: number;
  bubbleDuration?: number;
}

export function RollingNotice(props: RollingNoticeProps) {
  /**
   * 默认配置
   */
  let {
    list = [],
    height = 32,
    fontSize = 16,
    duration = 3000,
    bubbleDuration = 300,
    ...defaultProps
  } = props;

  // 冒泡时间必须大于间隔时间
  if (duration < bubbleDuration + 100) {
    duration = bubbleDuration + 100;
  }

  const styles = style(height, fontSize, bubbleDuration);

  const [current, setCurrent] = useState<number>(0);
  const [scroll, setScroll] = useState<SerializedStyles | undefined>(undefined);

  useInterval(() => {
    // 只有列表长度>0，才有滚动效果
    if (list.length > 1) {
      setScroll(styles.withScroll);
    }
  }, duration);

  // 获取列表数据
  const showList: Array<React.ReactNode> = [];
  if (list.length === 1) {
    showList.push(list[0]);
  } else if (list.length > 1) {
    showList.push(list[current]);
    if (current === list.length - 1) {
      showList.push(list[0]);
    } else {
      showList.push(list[current + 1]);
    }
  }

  // 冒泡动画结束时触发
  const transitionEnd = () => {
    setCurrent(current >= list.length - 1 ? 0 : current + 1);
    setScroll(undefined);
  };

  return (
    <div {...defaultProps} css={styles.container}>
      <ul css={[styles.ul, scroll]} onTransitionEnd={transitionEnd}>
        {showList.map((item, index) => {
          let content: React.ReactNode = item;
          if (typeof content === "string") {
            content = <p css={styles.textItem}>{content}</p>;
          }
          return (
            <li css={styles.li} key={index} className="cl-RollingNotice-item">
              {content}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
