import { useConfig } from "$/modules/proxy";
import ky from "ky";
import { useEffect, useState } from "react";

type GetModelsResponse = {
  data: Array<{
    created: number;
    id: string;
    object: string;
    owned_by: string;
  }>;
  object: string;
};

export function useModels() {
  const { config } = useConfig();

  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<GetModelsResponse["data"]>([]);

  const loadModels = async () => {
    if (!config.host || !config.port) return;

    setLoading(true);

    const { data } = await ky(`http://${config.host}:${config.port}/v1/models`, {
      headers: { "x-api-key": config["api-keys"]![0] },
    }).json<GetModelsResponse>();

    setModels(data);

    setLoading(false);
  };

  // oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps
  useEffect(() => (loadModels(), undefined), []);

  return { loading, models };
}
