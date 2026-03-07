import { Button, Modal, Tabs } from "@heroui/react";

// type ButtonAddProviderProps = {};

export function ButtonAddProvider() {
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
                  <Button variant="secondary" fullWidth>
                    Antigravity
                  </Button>
                  <Button variant="secondary" fullWidth>
                    Claude
                  </Button>
                  <Button variant="secondary" fullWidth>
                    Codex
                  </Button>
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
