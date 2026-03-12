import { useCredentialItems, useOAuthLogin } from "$/modules/credentials";
import { Button, Dropdown, Header, Modal, Separator, Spinner } from "@heroui/react";
import { capitalize } from "lodash-es";
import { useState } from "react";

export function ButtonAddCredential() {
  const { refreshItem } = useCredentialItems();

  const [openOAuthModal, setOpenOAuthModal] = useState(false);

  const { startLogin, cancelLogin, pending } = useOAuthLogin({
    onSuccess: () => {
      setOpenOAuthModal(false);
      refreshItem();
    },
  });

  const handleActionChange = async (key: string | number) => {
    if (String(key).startsWith("oauth-")) {
      setOpenOAuthModal(true);
      const provider = String(key).replace("oauth-", "");
      await startLogin(provider as any);
      return;
    }
  };

  return (
    <>
      <Dropdown>
        <Button size="sm">Add</Button>

        <Dropdown.Popover>
          <Dropdown.Menu onAction={handleActionChange}>
            <Header>OAuth</Header>
            <Dropdown.Item id="oauth-antigravity">Antigravity</Dropdown.Item>
            <Dropdown.Item id="oauth-claude">Claude</Dropdown.Item>
            <Dropdown.Item id="oauth-codex">Codex</Dropdown.Item>

            <Separator />

            <Header>API Key</Header>
            <Dropdown.Item id="api-key-claude">Claude</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>

      <Modal
        isOpen={openOAuthModal}
        onOpenChange={async (open) => {
          if (!open) await cancelLogin();
          setOpenOAuthModal(false);
        }}
      >
        <Modal.Backdrop isDismissable={false}>
          <Modal.Container>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Heading>Login via OAuth</Modal.Heading>
              </Modal.Header>
              <Modal.Body>Waiting for {capitalize(pending ?? "")} login to complete...</Modal.Body>
              <Modal.Footer>
                <Button slot="close" variant="danger-soft" fullWidth>
                  <Spinner color="danger" size="sm" /> Cancel
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
