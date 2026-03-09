import { Loading } from "$/core/ui/loading";
import { useModels } from "$/modules/models/hooks/use-models";

export function TableModels() {
  const { loading, models } = useModels();

  if (loading) return <Loading />;

  return <div>{JSON.stringify(models, null, 2)}</div>;
}
