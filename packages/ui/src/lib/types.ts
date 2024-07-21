export interface ConfirmationInterface {
  onConfirm: () => Promise<void> | void;
  onCancel?: () => void;
  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText?: string;
  confirmButtonColor?: "green" | "red";
}
