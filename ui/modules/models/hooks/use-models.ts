import { useModelsStore } from "$/core/stores";
import { useConfig } from "$/modules/proxy";
import ky from "ky";
import { useCallback, useEffect, useState } from "react";

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

  const [models, setModels] = useModelsStore();

  const [loading, setLoading] = useState(false);

  const loadModels = useCallback(async () => {
    if (!config.port) return;

    try {
      setLoading(true);
      console.log(config);
      const { data } = await ky(`http://127.0.0.1:${config.port}/v1/models`).json<GetModelsResponse>();

      setModels(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [config, setModels]);

  useEffect(() => (loadModels(), undefined), [loadModels]);

  return { loading, models, refreshModels: loadModels };
}
