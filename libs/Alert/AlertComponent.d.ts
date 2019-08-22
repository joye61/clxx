/// <reference types="react" />
declare type Callback = () => void;
export interface AlertComponentProps<T> {
    content: T;
    showMask?: boolean;
    showCancel?: boolean;
    cancelText?: string;
    confirmText?: string;
    onConfirm?: Callback;
    onCancel?: Callback;
    onHide?: Callback;
}
export declare function AlertComponent<T>({ content, showMask, showCancel, cancelText, confirmText, onConfirm, onCancel, onHide }: AlertComponentProps<T>): JSX.Element;
export {};
