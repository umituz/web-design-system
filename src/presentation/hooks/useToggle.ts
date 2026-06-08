/**
 * useToggle Hook
 * @description Toggle boolean state with explicit setValue
 */

import { useCallback, useState, useMemo } from 'react';

export type UseToggleReturn = [boolean, () => void, (value: boolean) => void];

export function useToggle(initialValue: boolean = false): UseToggleReturn {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return useMemo<UseToggleReturn>(() => [value, toggle, setValue], [value, toggle]);
}
