import React from "react";
import { SelfAdaptionProps, SelfAdaption } from "./SelfAdaption";

export interface AppContainerProps extends SelfAdaptionProps {
  children?: React.ReactNode;
}

/**
 * 一个默认自适应过的快捷容器
 * @param props
 */
export function AppContainer(props: AppContainerProps): React.ReactElement {
  const { children, ...normalizeProps } = props;
  return (
    <React.Fragment>
      <SelfAdaption {...normalizeProps} />
      {children}
    </React.Fragment>
  );
}
