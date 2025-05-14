"use client";

import { useEffect, useState } from "react";

export function shared<T>(initialValue: T) {
  let currentValue = initialValue;
  const listeners = new Set<(value: T) => void>();

  const store = {
    get: () => currentValue,
    set: (newValue: T) => {
      currentValue = newValue;
      listeners.forEach((listener) => listener(currentValue));
    },
    subscribe: (listener: (value: T) => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };

  function useStore() {
    const [state, setState] = useState(currentValue);

    useEffect(() => {
      const unsubscribe = store.subscribe(setState);
      return () => {
        unsubscribe();
      };
    }, []);

    return [state, store.set] as const;
  }

  return [store, useStore] as const;
}

