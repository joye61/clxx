import { ConfigType, Dayjs } from "dayjs";
import { SetStateAction, Dispatch } from "react";
import { ControlsProps } from "@clxx/picker/build/Controls";

export interface WrapperProps extends ControlsProps {
  /**
   * 一个dayjs可以解析的合法值，如果没有传递，则默认取当前时间
   */
  date?: ConfigType;
  /**
   * 选择器可以选择的最大时间值，默认最大值为2100/01/01
   */
  max?: ConfigType;
  /**
   * 选择器可以选择的最小时间值，默认最小值为1900/01/01
   */
  min?: ConfigType;
  /**
   * 选择器模式ymdhis，不区分大小写，默认ymd，必须按照顺序出现
   * 错误：Yd，中间缺少m
   * 错误：ya，a不存在
   * 六个字母代表
   * y：年
   * m：月
   * d：日
   * h：时
   * i：分
   * s：秒
   */
  mode?: string;
  /**
   * 值每次变化都会触发
   */
  onChange?: (value: Dayjs & any) => void;

  /**
   * 取消按钮点击时触发
   */
  onCancel?: () => void;
  /**
   * 确定按钮点击时触发
   */
  onConfirm?: ((value: Dayjs) => void) & any;
}

/**
 * 上下文对象
 */
export interface DatePickerContext {
  value?: Dayjs;
  max?: Dayjs;
  min?: Dayjs;
  mode?: string;
  setValue?: Dispatch<SetStateAction<Dayjs>>;
}

export interface DateTimePickerProps
  extends WrapperProps,
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    > {
  children?: React.ReactNode;
  placeholder?: string;
  onChange?: any;
}
