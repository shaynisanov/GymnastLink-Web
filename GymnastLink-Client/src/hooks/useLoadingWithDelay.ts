import {delay} from 'lodash';
import {useEffect, useState} from 'react';

const useLoadingWithDelay = (isLoading: boolean, delayTime: number = 400) => {
  const [loading, setLoading] = useState(isLoading);

  useEffect(() => {
    if (isLoading !== loading) {
      delay(() => setLoading(isLoading), delayTime);
    }
  }, [isLoading]);

  return loading;
};

export {useLoadingWithDelay};
