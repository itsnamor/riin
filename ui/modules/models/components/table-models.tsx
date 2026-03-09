import { Loading } from "$/core/ui/loading";
import { useModels } from "$/modules/models/hooks/use-models";
import { Chip, EmptyState, Table } from "@heroui/react";

export function TableModels() {
  const { loading, models } = useModels();

  if (loading) return <Loading />;

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content>
          <Table.Header>
            <Table.Column isRowHeader>#</Table.Column>
            <Table.Column isRowHeader>Model ID</Table.Column>
            <Table.Column isRowHeader>Owner</Table.Column>
          </Table.Header>

          <Table.Body renderEmptyState={() => <EmptyState className="flex justify-center">Nothing to show</EmptyState>}>
            {models.map((model, idx) => (
              <Table.Row key={model.id} id={model.id}>
                <Table.Cell>{idx + 1}</Table.Cell>
                <Table.Cell className="font-mono">{model.id}</Table.Cell>
                <Table.Cell>
                  <Chip className="font-light">{model.owned_by}</Chip>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
