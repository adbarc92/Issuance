import { useState } from 'react';

export const useForceUpdate = (): (() => void) => {
  const [stateVar, setStateVar] = useState(false);
  return () => {
    setStateVar(!stateVar);
  };
};
