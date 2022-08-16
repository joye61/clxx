import { Flex, FlexProps } from '.';

export function RowStart(props: FlexProps) {
  const {
    flexDirection = 'row',
    justifyContent = 'flex-start',
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
export function RowEnd(props: FlexProps) {
  const {
    flexDirection = 'row',
    justifyContent = 'flex-end',
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
export function RowCenter(props: FlexProps) {
  const { flexDirection = 'row', justifyContent = 'center', ...extra } = props;
  return (
    <Flex
      flexDirection={flexDirection}
      justifyContent={justifyContent}
      {...extra}
    />
  );
}
export function RowBetween(props: FlexProps) {
  const {
    flexDirection = 'row',
    justifyContent = 'space-between',
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
export function RowAround(props: FlexProps) {
  const {
    flexDirection = 'row',
    justifyContent = 'space-around',
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
export function RowEvenly(props: FlexProps) {
  const {
    flexDirection = 'row',
    justifyContent = 'space-evenly',
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

export { RowStart as Row };
