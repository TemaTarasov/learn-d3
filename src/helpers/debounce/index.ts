import { useMemo } from 'react';

type DebounceSet = (callback: Function, time?: number) => void;
type DebounceClear = () => void;

interface Debounce {
  set: DebounceSet,
  clear: DebounceClear
}

const debounce = (): Debounce => {
  let timeout: any;

  const clear: DebounceClear = () => {
    clearTimeout(timeout);
  };

  const set: DebounceSet = (callback, time = 1) => {
    clear();

    timeout = setTimeout(callback, time);
  };

  return { set, clear };
};

export const useDebounce = (): Debounce => (
  useMemo(debounce, [])
);

export default debounce;
