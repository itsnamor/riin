import { useCredentialItems } from "$/modules/accounts";
import { Button, Modal, toast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { invoke } from "@tauri-apps/api/core";

type ButtonDeleteAccountProps = {
  filename: string;
};

export function ButtonDeleteAccount({ filename }: ButtonDeleteAccountProps) {
  const { refreshItem, loading } = useCredentialItems();

  const handleDelete = async () => {
    try {
      await invoke("delete_credential", { filename });
      await refreshItem();
    } catch (err) {
      console.error(err);
      toast.danger("Failed to delete account");
    }
  };

  return (
    <Modal>
      <Button variant="ghost" isIconOnly className="text-danger" size="sm">
        <Icon icon="solar:trash-bin-2-line-duotone" />
      </Button>

      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Deleting account?</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete <span className="font-semibold">{filename}</span> account?
            </Modal.Body>

            <Modal.Footer>
              <Button variant="danger" onClick={handleDelete} isPending={loading} isDisabled={loading}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
