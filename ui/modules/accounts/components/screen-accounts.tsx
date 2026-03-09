import { useSetHeaderSlot } from "$/core/stores/layout";
import { ButtonRefresh } from "$/core/ui";
import { Loading } from "$/core/ui/loading";
import { ButtonAddAccount, ButtonViewRawCredential, ToggleStatus, useCredentialItems } from "$/modules/accounts";
import { ButtonDeleteAccount } from "$/modules/accounts/components/button-delete-account";
import { EmptyState, Table } from "@heroui/react";
import { capitalize } from "lodash-es";

export function ScreenAccounts() {
  const { items, loading, refreshItem } = useCredentialItems();

  useSetHeaderSlot(
    <div className="flex gap-1">
      <ButtonRefresh onClick={refreshItem} isDisabled={loading} isPending={loading} />
      <ButtonAddAccount />
    </div>,
  );

  if (loading) return <Loading />;

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content>
          <Table.Header>
            <Table.Column isRowHeader>Email</Table.Column>
            <Table.Column isRowHeader>Status</Table.Column>
            <Table.Column isRowHeader>Actions</Table.Column>
          </Table.Header>

          <Table.Body renderEmptyState={() => <EmptyState className="flex justify-center">Nothing to show</EmptyState>}>
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
                  <ToggleStatus filename={filename} />
                </Table.Cell>
                <Table.Cell>
                  <div className="flex">
                    <ButtonViewRawCredential filename={filename} />
                    <ButtonDeleteAccount filename={filename} />
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
