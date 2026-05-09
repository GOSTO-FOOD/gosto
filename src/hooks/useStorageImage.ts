import { useState, useEffect } from "react";

export function useStorageImage(_path: string | null): { url: string | null; loading: boolean } {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setUrl(null);
    setLoading(false);
  }, [_path]);

  return { url, loading };
}
