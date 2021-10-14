/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Flex, FlexProps } from ".";

export function ColStart(props: FlexProps) {
  const {
    flexDirection = "column",
    justifyContent = "flex-start",
    ...extra
  } = props;
  return (
    <Flex
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      {...extra}
    />
  );
}
export function ColEnd(props: FlexProps) {
  const {
    flexDirection = "column",
    justifyContent = "flex-end",
    ...extra
  } = props;
  return (
    <Flex
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      {...extra}
    />
  );
}
export function ColCenter(props: FlexProps) {
  const {
    flexDirection = "column",
    justifyContent = "center",
    ...extra
  } = props;
  return (
    <Flex
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      {...extra}
    />
  );
}
export function ColBetween(props: FlexProps) {
  const {
    flexDirection = "column",
    justifyContent = "space-between",
    ...extra
  } = props;
  return (
    <Flex
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      {...extra}
    />
  );
}
export function ColAround(props: FlexProps) {
  const {
    flexDirection = "column",
    justifyContent = "space-around",
    ...extra
  } = props;
  return (
    <Flex
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      {...extra}
    />
  );
}
export function ColEvenly(props: FlexProps) {
  const {
    flexDirection = "column",
    justifyContent = "space-evenly",
    ...extra
  } = props;
  return (
    <Flex
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      {...extra}
    />
  );
}

export { ColStart as Col };
