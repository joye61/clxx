import React from "react";
declare type Callback = () => void;
export interface AlertComponentProps {
    content: string | React.ReactElement;
    showMask?: boolean;
    showCancel?: boolean;
    cancelText?: string;
    confirmText?: string;
    onConfirm?: Callback;
    onCancel?: Callback;
    onHide?: Callback;
}
export declare function AlertComponent({ content, showMask, showCancel, cancelText, confirmText, onConfirm, onCancel, onHide }: AlertComponentProps): JSX.Element;
export {};
