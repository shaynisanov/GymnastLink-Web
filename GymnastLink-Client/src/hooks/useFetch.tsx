import {useEffect, useState} from 'react';

interface UseFetchResult<T> {
  data?: T;
  isFetching: boolean;
  isSuccess: boolean;
  error: Error | null;
}

const useFetch = <T,>(fetchFunction: (...args: any[]) => Promise<T>, ...args: any[]): UseFetchResult<T> => {
  const [data, setData] = useState<T>();
  const [isFetching, setIsFetching] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const result = await fetchFunction(args);

        setData(result);
        setIsSuccess(true);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [fetchFunction, ...args]);

  return {data, isFetching, error, isSuccess};
};

export {useFetch};
