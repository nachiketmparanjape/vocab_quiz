import { useState, useEffect, useCallback } from 'react';
import { loadLists } from '../utils/storage.js';

export function useLists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await loadLists();
    setLists(data);
    return data;
  }, []);

  useEffect(() => {
    loadLists()
      .then(setLists)
      .finally(() => setLoading(false));
  }, []);

  return { lists, loading, refresh };
}
