import { useOAuthLogin } from "$/modules/accounts";
import { Button, Modal, Spinner, Tabs } from "@heroui/react";
import { capitalize } from "lodash-es";
import { Ref, useImperativeHandle, useRef, useState } from "react";

type ButtonAddAccountProps = {
  onSuccess?: () => void;
};

export function ButtonAddAccount({ onSuccess }: ButtonAddAccountProps) {
  const [open, setOpen] = useState(false);
  const loginWithOAuthRef = useRef<LoginWithOauthRef>(null);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      loginWithOAuthRef.current?.cancelLogin();
    }

    setOpen(isOpen);
  };

  return (
    <Modal isOpen={open} onOpenChange={handleOpenChange}>
      <Button size="sm">Add</Button>

      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="min-h-70">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Add provider</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <Tabs className="mt-2" onSelectionChange={() => loginWithOAuthRef.current?.cancelLogin()}>
                <Tabs.ListContainer>
                  <Tabs.List aria-label="Options">
                    <Tabs.Tab id="oauth">
                      OAuth
                      <Tabs.Indicator />
                    </Tabs.Tab>
                    <Tabs.Tab id="key">
                      Key
                      <Tabs.Indicator />
                    </Tabs.Tab>
                  </Tabs.List>
                </Tabs.ListContainer>

                <Tabs.Panel id="oauth" className="flex flex-col gap-2 px-0">
                  <LoginWithOAuth onSuccess={handleSuccess} ref={loginWithOAuthRef} />
                </Tabs.Panel>

                <Tabs.Panel id="key" className="flex flex-col gap-2 px-0">
                  Coming soon
                </Tabs.Panel>
              </Tabs>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

/* LOGIN WITH OAUTH */
const providers = [
  { id: "antigravity", label: "Antigravity" },
  { id: "claude", label: "Claude" },
  { id: "codex", label: "Codex" },
] as const;

type LoginWithOauthRef = {
  cancelLogin: () => Promise<void>;
};

type LoginWithOAuthProps = {
  onSuccess?: () => void;
  ref?: Ref<LoginWithOauthRef>;
};

function LoginWithOAuth({ onSuccess, ref }: LoginWithOAuthProps) {
  const { startLogin, cancelLogin, pending } = useOAuthLogin({ onSuccess });

  useImperativeHandle(ref, () => ({
    cancelLogin,
  }));

  return (
    <>
      {!pending &&
        providers.map(({ id, label }) => (
          <Button key={id} variant="secondary" fullWidth onPress={() => startLogin(id)}>
            {label}
          </Button>
        ))}

      {pending && (
        <Button variant="danger-soft" fullWidth onPress={cancelLogin}>
          <Spinner size="sm" color="danger" />
          Cancel {capitalize(pending)} login
        </Button>
      )}
    </>
  );
}
