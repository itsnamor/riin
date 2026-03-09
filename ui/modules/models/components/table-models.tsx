import { Loading } from "$/core/ui/loading";
import { useModels } from "$/modules/models/hooks/use-models";
import { EmptyState, Table } from "@heroui/react";

export function TableModels() {
  const { loading, models } = useModels();

  if (loading) return <Loading />;

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content>
          <Table.Header>
            <Table.Column isRowHeader>#</Table.Column>
            <Table.Column>Model ID</Table.Column>
            <Table.Column>Owner</Table.Column>
          </Table.Header>

          <Table.Body renderEmptyState={() => <EmptyState className="flex justify-center">Nothing to show</EmptyState>}>
            {models.map((model, idx) => (
              <Table.Row key={model.id} id={model.id}>
                <Table.Cell>{idx + 1}</Table.Cell>
                <Table.Cell>{model.id}</Table.Cell>
                <Table.Cell>{model.owned_by}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
