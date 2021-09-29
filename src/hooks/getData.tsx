// * Give it a function that creates a promise that gets data
// * Given any number of functions like getUsers and a string that distinguishes the requests from each other; it returns an object that contains a boolean, loading, and a data object that
//   * Alternatively, it could accept an array of functions and return an array of data objects
// * This hook should combine the boilerplate atop Dashboard and UsersDisplay--including the two useState hooks, as well as the useEffect call.

import { useState, useEffect } from 'react';

// * T is a Typescript generic; when the interface is created, you pass in any type and T will be replaced by it
export interface IDataLoader<T> {
  loading: boolean;
  data: T | null | undefined;
  error: string;
  clearCache: () => void;
}

export const requestCache: Record<
  string,
  any
> = ((window as any).requestCache = {});

// *** CacheKeys should be modeled after endpoints
export enum CacheKey {
  PERSONNEL = 'PERSONNEL',
  TASKS = 'TASKS',
  USERS = 'USERS',
  PROJECTS = 'PROJECTS',
  COMMENTS = 'COMMENTS',
  UPDATE_ITEMS = 'UPDATE_ITEMS',
  SUBSCRIPTIONS = 'SUBSCRIPTIONS',
}

type LoaderFunction = () => Promise<any>;

// * For editing the cache from a different component with no access to clearCache
export const clearCacheWithoutRender = (
  baseCacheKey: CacheKey,
  id?: string
): void => {
  const cacheKey = baseCacheKey + (id ?? '');
  delete requestCache[cacheKey];
};

// * The Typescript generic type is set when this hook is called with getUsers, which has a return type of Promise<User[]>; this is inferred from the type of the argument; generic types could be considered a variable type, as they are entirely dependent on the input
export function useGetData<Datatype>(
  loader: () => Promise<Datatype>,
  baseCacheKey: CacheKey,
  id?: string
): IDataLoader<Datatype> {
  const cacheKey = baseCacheKey + (id ?? ''); // * If id is 0, we still want to append it even though it would be falsy; if 0 were not appended, it would return the cached data for all users, which would be incorrect

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<null | Datatype | undefined>(
    requestCache[cacheKey]
  ); // * Data will be null in case of erroneous requests
  const [error, setError] = useState('');

  useEffect(() => {
    if (data === undefined) {
      setLoading(true);
      loader()
        .then((data: Datatype) => {
          setData(data);
          requestCache[cacheKey] = data;
          setError('');
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError('Failed to get data.'); //
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [data, loader, cacheKey]);

  return {
    loading: loading || (data === undefined && !error ? true : false),
    data,
    error,
    clearCache: () => {
      delete requestCache[cacheKey];
      setData(undefined);
      setLoading(true);
    },
  };
}
