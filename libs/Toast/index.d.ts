import { ToastComponentProps } from "./ToastComponent";
export interface ToastType {
    container: null | HTMLElement;
    create<T>(option: T | ToastComponentProps<T>): void;
}
export declare const Toast: ToastType;
