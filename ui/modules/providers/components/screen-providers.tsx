import { useSetHeaderSlot } from "$/core/stores/layout";
import { ButtonAddProvider, ToggleStatus, useCredentialItems } from "$/modules/providers";
import { ButtonViewRawCredential } from "$/modules/providers/components/button-view-raw-credential";
import { Button, Spinner, Table } from "@heroui/react";
import { Icon } from "@iconify/react";
import { capitalize } from "lodash-es";

export function ScreenProviders() {
  const { items, loading, refreshItem } = useCredentialItems();

  useSetHeaderSlot(
    <div className="flex gap-1">
      <Button variant="tertiary" isIconOnly size="sm" onClick={refreshItem} isDisabled={loading} isPending={loading}>
        <Icon icon="solar:restart-line-duotone" />
      </Button>

      <ButtonAddProvider onSuccess={refreshItem} />
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
            <Table.Column isRowHeader>Actions</Table.Column>
          </Table.Header>

          <Table.Body>
            {items.map(({ credential, filename }) => (
              <Table.Row key={filename} id={filename}>
                <Table.Cell>
                  <div className="flex flex-col gap-1">
                    <span> {credential.email} </span>
                    <div>
                      <span className="text-muted text-xs">{capitalize(credential.type)}</span>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-1">
                    <ToggleStatus filename={filename} />
                    <ButtonViewRawCredential filename={filename} />
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
