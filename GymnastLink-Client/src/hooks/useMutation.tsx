import {useState} from 'react';

interface UseMutationResult<T> {
  isLoading: boolean;
  isSuccess: boolean;
  trigger: (...args: any[]) => Promise<T>;
}

const useMutation = <T,>(mutationFunction: (...args: any[]) => Promise<T>): UseMutationResult<T> => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const trigger = async (...args: any[]) => {
    try {
      setIsLoading(true);
      const result = await mutationFunction(...args);

      setIsLoading(false);
      setIsSuccess(true);

      return result;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  return {isLoading, isSuccess, trigger};
};

export {useMutation};
