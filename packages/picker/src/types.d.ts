type PickerChangeFunc = (index: number) => void;
type PickerConfirm = (result: { index: number; value: any }) => void;

interface ScrollContentProps {
  selected?: number;
  list?: Array<string>;
  onChange?: PickerChangeFunc;
}

interface PickerDialogProps {
  showResult?: boolean;
  list?: Array<string>;
  selected?: number;
  onCancel?: () => void;
  onConfirm?: PickerConfirm;
  confirmText?: string;
  cancelText?: string;
}

interface PickerProps
  extends PickerDialogProps,
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    > {
  children?: React.ReactNode;
  placeholder?: React.ReactNode & any;
}
