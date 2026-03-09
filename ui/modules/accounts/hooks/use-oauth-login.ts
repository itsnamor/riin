import { toast } from "@heroui/react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { capitalize } from "lodash-es";
import { useEffect, useState } from "react";

type OAuthProvider = "antigravity" | "claude" | "codex";

type OAuthLoginResult = {
  provider: string;
  success: boolean;
  code: number | null;
};

type UseOAuthLoginProps = {
  onSuccess?: () => void;
};

export function useOAuthLogin({ onSuccess }: UseOAuthLoginProps = {}) {
  const [pending, setPending] = useState<OAuthProvider | null>(null);

  useEffect(() => {
    const removeListener = listen<OAuthLoginResult>("oauth-login-completed", ({ payload }) => {
      const { provider, success } = payload;

      setPending((current) => (current === provider ? null : current));

      if (success) {
        toast.success(`${capitalize(provider)} login successful`);
        onSuccess?.();
      }
    });

    return () => {
      removeListener.then((fn) => fn());
    };
  }, [onSuccess]);

  const startLogin = async (provider: OAuthProvider) => {
    if (pending) return;

    setPending(provider);
    try {
      await invoke("start_oauth_login", { provider });
    } catch (err) {
      console.error(err);
      toast.danger(`Failed to start ${capitalize(provider)} login`);
      setPending(null);
    }
  };

  const cancelLogin = async () => {
    if (!pending) return;

    try {
      await invoke("cancel_oauth_login");
    } catch (err) {
      console.error(err);
    }
    setPending(null);
  };

  return { startLogin, cancelLogin, pending };
}
