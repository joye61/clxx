import React from "react";

export interface ClickableProps {
  children?: React.ReactNode;
  onPress?: () => void;
  [key: string]: any;
}

export function Clickable(props: ClickableProps) {
  const children = props.children || null;
  const onPress =
    typeof props.onPress === "function" ? props.onPress : () => {};

  delete props.onPress;
  delete props.children;

  let config: any = {
    ...props
  };



  return <div {...config} />;
}
