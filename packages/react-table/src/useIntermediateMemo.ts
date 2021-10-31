import { useEffect, useState } from 'react';

export default function useIntermediateMemo<T>(inputObj: T): T {
  const [memoObj, setMemoObj] = useState<T>(inputObj);

  useEffect(() => {
    if (JSON.stringify(memoObj) !== JSON.stringify(inputObj)) setMemoObj(inputObj);
  }, [inputObj]);

  return memoObj;
}
