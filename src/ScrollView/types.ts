import { HeightProperty } from "csstype";

export interface ContainerProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  /**
   * 可滚动内容
   */
  children?: React.ReactNode;
  /**
   * 滚动容器高度，要激活容器，必须传递此值
   * 否则容器将永远被内容撑成和内容一样高
   */
  height?: HeightProperty<number>;
  onReachBottom?: () => void;
}

export interface ScrollBarProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
		
	}
