import { useModelsStore } from "$/core/stores/models";
import { useConfig } from "$/modules/proxy";
import { toast } from "@heroui/react";
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
    if (!config.host || !config.port) return;

    try {
      setLoading(true);
      const { data } = await ky(`http://${config.host}:${config.port}/v1/models`, {
        headers: { "x-api-key": config["api-keys"]![0] },
      }).json<GetModelsResponse>();

      setModels(data);
    } catch (error) {
      console.error(error);
      toast.danger(String(error));
    } finally {
      setLoading(false);
    }
  }, [config, setModels]);

  useEffect(() => (loadModels(), undefined), [loadModels]);

  return { loading, models, refreshModels: loadModels };
}
