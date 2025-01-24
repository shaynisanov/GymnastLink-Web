import {useState} from 'react';

interface UseMutationResult<T> {
  data: T | null;
  loading: boolean;
  isSuccess: boolean;
  error: Error | null;
  trigger: (...args: any[]) => Promise<void>;
}

const useMutation = <T,>(mutationFunction: (...args: any[]) => Promise<T>): UseMutationResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const trigger = async (...args: any[]) => {
    try {
      setLoading(true);
      const result = await mutationFunction(...args);

      setData(result);
      setIsSuccess(true);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {data, loading, isSuccess, error, trigger};
};

export {useMutation};
