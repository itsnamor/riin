import { useCredentialItems } from "$/modules/credentials";
import { Button, Modal, toast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { invoke } from "@tauri-apps/api/core";

type ButtonDeleteCredentialProps = {
  filename: string;
};

export function ButtonDeleteCredential({ filename }: ButtonDeleteCredentialProps) {
  const { refreshItem, loading } = useCredentialItems();

  const handleDelete = async () => {
    try {
      await invoke("delete_credential", { filename });
      await refreshItem();
    } catch (err) {
      console.error(err);
      toast.danger("Failed to delete credential");
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
              <Modal.Heading>Deleting credential?</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <div>Are you sure you want to delete following credential?</div>
              <div className="text-danger mt-1 font-mono font-medium">{filename}</div>
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
