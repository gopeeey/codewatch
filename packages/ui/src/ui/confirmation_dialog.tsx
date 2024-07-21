import { ConfirmationDialogContext } from "@lib/contexts";
import { ConfirmationInterface } from "@lib/types";
import { useContext, useEffect, useRef, useState } from "react";
import { Button, ButtonBase } from "./buttons";
import { Modal, ModalCard } from "./modal";

export function ConfirmationDialog() {
  const { confirmation, dispatchConfirmation } = useContext(
    ConfirmationDialogContext
  );
  const [confirming, setConfirming] = useState(false);
  const [currentConfirmation, setCurrentConfirmation] =
    useState<ConfirmationInterface | null>(null);
  const closeTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (confirmation) {
      setCurrentConfirmation(confirmation);
    } else {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
      closeTimeout.current = setTimeout(
        () => setCurrentConfirmation(null),
        500
      );
    }
  }, [confirmation]);

  const handleCancel = () => {
    if (currentConfirmation && currentConfirmation.onCancel)
      currentConfirmation.onCancel();
    dispatchConfirmation(null);
  };

  const handleConfirm = async () => {
    if (!currentConfirmation) return;
    setConfirming(true);
    await currentConfirmation.onConfirm();
    setConfirming(false);
    dispatchConfirmation(null);
  };

  return (
    <Modal open={Boolean(confirmation)} onClose={handleCancel}>
      <ModalCard className="px-8 pt-12 pb-8 rounded-[0.9rem] max-w-[27rem]">
        <h2 className="font-semibold">{currentConfirmation?.title}</h2>
        <p className="text-grey-600 mt-3 text-[0.9rem]">
          {currentConfirmation?.message}
        </p>
        <div className="mt-20 flex justify-end">
          <ButtonBase onClick={() => dispatchConfirmation(null)}>
            {currentConfirmation?.cancelButtonText || "Cancel"}
          </ButtonBase>
          <Button
            onClick={handleConfirm}
            loading={confirming}
            className="ml-4 text-[0.9rem] px-7 py-3"
            color={
              currentConfirmation?.confirmButtonColor === "red"
                ? "error"
                : "primary"
            }
          >
            {currentConfirmation?.confirmButtonText || "Confirm"}
          </Button>
        </div>
      </ModalCard>
    </Modal>
  );
}
