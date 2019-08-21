import React from "react";
declare type Callback = () => void;
export interface ToastComponentProps {
    content: string | React.Component;
    duration?: number;
    onEnd?: Callback;
}
export declare function ToastComponent({ content, duration, onEnd }: ToastComponentProps): JSX.Element;
export {};
