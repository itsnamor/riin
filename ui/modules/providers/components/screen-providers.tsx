import { useSetHeaderSlot } from "$/core/stores/layout";
import { ButtonAddProvider, SwitchStatus, useCredentialItems } from "$/modules/providers";
import { Button, Chip, Spinner, Table } from "@heroui/react";
import { Icon } from "@iconify/react";

export function ScreenProviders() {
  const { items, loading, refreshItem } = useCredentialItems();

  useSetHeaderSlot(
    <div className="flex gap-1">
      <Button variant="tertiary" isIconOnly size="sm" onClick={refreshItem} isDisabled={loading} isPending={loading}>
        <Icon icon="solar:restart-line-duotone" />
      </Button>

      <ButtonAddProvider />
    </div>,
  );

  if (loading) {
    return (
      <div className="flex justify-center gap-4">
        <Spinner />
      </div>
    );
  }

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Providers">
          <Table.Header>
            <Table.Column isRowHeader>Email</Table.Column>
            <Table.Column>Type</Table.Column>
            <Table.Column>Actions</Table.Column>
          </Table.Header>
          <Table.Body>
            {items.map(({ credential, filename }) => (
              <Table.Row key={filename} id={filename}>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    {credential.email}
                    {credential.disabled && (
                      <Chip size="sm" color="danger" variant="soft">
                        disabled
                      </Chip>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>{credential.type}</Table.Cell>
                <Table.Cell>
                  <SwitchStatus filename={filename} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
