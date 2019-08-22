/// <reference types="react" />
export interface ToastComponentProps<T> {
    onEnd?: () => void;
    content: T;
    position?: "top" | "middle" | "bottom";
    duration?: number;
}
export declare function ToastComponent<T>({ content, position, duration, onEnd }: ToastComponentProps<T>): JSX.Element;
