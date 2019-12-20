import React from "react";
import { DatePickerProps } from "./types";
import pick from "lodash/pick";
import omit from "lodash/omit";
import { Dayjs } from "dayjs";
import ReactDOM from "react-dom";
import { Dialog } from "./DatePicker";

export interface WrapperProps
  extends DatePickerProps,
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    > {
  children?: React.ReactNode;
  onChange?: (value: Dayjs & any) => void;
}

export function DatePicker(props: WrapperProps) {
  const dpPropsArray = [
    "date",
    "max",
    "min",
    "mode",
    "onCancel",
    "onConfirm",
    "onHide"
  ];
  const wrapperProps = omit(props, ["children", "onChange", ...dpPropsArray]);
  const dpProps = pick(props, dpPropsArray);
  dpProps.onConfirm = value => {
    typeof props.onChange === "function" && props.onChange(value);
  };

  return (
    <div
      {...wrapperProps}
      onClick={() => {
        showDatePicker(dpProps);
      }}
    >
      {props.children}
    </div>
  );
}

/**
 * 函数方式调用
 * @param option 选择器选项
 */
export function showDatePicker(option: DatePickerProps) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const onHide = () => {
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  };
  ReactDOM.render(<Dialog {...option} onHide={onHide} />, container);
}
