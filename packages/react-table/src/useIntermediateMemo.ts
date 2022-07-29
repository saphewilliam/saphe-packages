import { useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stringify(source: any): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonReplacer = function (_: string, val: any) {
    if (typeof val === 'function') return val.toString();
    return val;
  };

  return JSON.stringify(source, jsonReplacer);
}

export default function useIntermediateMemo<T>(inputObj: T): T {
  const [memoObj, setMemoObj] = useState<T>(inputObj);

  useEffect(() => {
    if (stringify(memoObj) !== stringify(inputObj)) setMemoObj(inputObj);
  }, [inputObj]);

  return memoObj;
}
