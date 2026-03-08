import { useOAuthLogin } from "$/modules/accounts";
import { Button, Modal, Spinner, Tabs } from "@heroui/react";

type ButtonAddAccountProps = {
  onSuccess?: () => void;
};

const providers = [
  { id: "antigravity", label: "Antigravity" },
  { id: "claude", label: "Claude" },
  { id: "codex", label: "Codex" },
] as const;

export function ButtonAddAccount({ onSuccess }: ButtonAddAccountProps) {
  const { startLogin, pending } = useOAuthLogin({ onSuccess });

  return (
    <Modal>
      <Button size="sm">Add</Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="min-h-70">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Add provider</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <Tabs className="mt-2">
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
                  {providers.map(({ id, label }) => (
                    <Button
                      key={id}
                      variant="secondary"
                      fullWidth
                      isDisabled={!!pending}
                      isPending={pending === id}
                      onPress={() => startLogin(id)}
                    >
                      {pending === id && <Spinner size="sm" />}
                      {label}
                    </Button>
                  ))}
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
