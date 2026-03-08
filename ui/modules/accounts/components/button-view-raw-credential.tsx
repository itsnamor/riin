import { useCredentialFilesValue } from "$/core/stores/credential";
import { Button, Modal } from "@heroui/react";
import { Icon } from "@iconify/react";

type ButtonViewRawCredentialProps = {
  filename: string;
};

export function ButtonViewRawCredential({ filename }: ButtonViewRawCredentialProps) {
  const items = useCredentialFilesValue();
  const item = items.find((i) => i.filename === filename);

  return (
    <Modal>
      <Button size="sm" variant="ghost" isIconOnly>
        <Icon icon="solar:eye-line-duotone" />
      </Button>

      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Raw JSON content</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-2">~/.config/riin/{filename}</div>
              <pre className="overflow-auto rounded-xl bg-neutral-100 p-4">
                <code className="font-mono">{JSON.stringify(item?.credential, null, 2) ?? "Credential not found"}</code>
              </pre>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
