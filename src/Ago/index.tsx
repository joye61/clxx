/** @jsx jsx */
import { jsx } from '@emotion/react';
import dayjs from 'dayjs';
import { ago } from '../utils/ago';

export interface AgoProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  date?: dayjs.ConfigType;
}

export function Ago(props: AgoProps) {
  const { date = dayjs(), ...attrs } = props;
  const result = ago(date);
  return <span {...attrs}>{result.format}</span>;
}
