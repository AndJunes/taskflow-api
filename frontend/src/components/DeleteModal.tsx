import { Modal } from "./Modal";

interface Props {
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteModal({ title, message, onConfirm, onClose }: Props) {
  return (
    <Modal onClose={onClose}>
      <h2 className="text-heading-l text-destructive">{title}</h2>
      <p className="mt-6 text-body-l text-medium-grey">{message}</p>
      <div className="mt-6 flex gap-4">
        <button onClick={onConfirm} className="flex-1 rounded-full bg-destructive py-2.5 text-body-m text-white hover:bg-destructive-hover">
          Delete
        </button>
        <button onClick={onClose} className="flex-1 rounded-full bg-primary/10 py-2.5 text-body-m text-primary hover:bg-primary/25">
          Cancel
        </button>
      </div>
    </Modal>
  );
}