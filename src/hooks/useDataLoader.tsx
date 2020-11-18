// useDataLoader Hook
// * Give it a function that creates a promise that gets data
// * Given any number of functions like getUsers and a string that distinguishes the requests from each other; it returns an object that contains a boolean, loading, and a data object that
//   * Alternatively, it could accept an array of functions and return an array of data objects
// * This hook should combine the boilerplate atop Dashboard and UsersDisplay--including the two useState hooks, as well as the useEffect call.

import { useState, useEffect } from 'react';

// T is a Typescript generic; when the interface is created, you pass in any type and T will be replaced by it
interface IDataLoader<T> {
  loading: boolean;
  data: T | null;
  error: string;
}

type LoaderFunction = () => Promise<any>;

// export const useDataLoader = (loaders: LoaderFunction[]): IDataLoader => {
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState([] as any[]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     Promise.all(
//       loaders.map(loader => {
//         return loader();
//       })
//     )
//       .then((data: any[]) => {
//         setData(data);
//         setError('');
//         setLoading(false);
//       })
//       .catch(err => {
//         setError(err);
//         setLoading(false);
//       });
//   });

//   return { loading, data, error };
// };

// The Typescript generic type is set when this hook is called with getUsers, which has a return type of Promise<User[]>; this is inferred from the type of the argument; generic types could be considered a variable type, as they are entirely dependent on the input
export function useGetData<Datatype>(
  loader: () => Promise<Datatype>
): IDataLoader<Datatype> {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<null | Datatype>(null);
  const [error, setError] = useState('');

  // This prevents an infinite load because state is preserved per hook
  const [loadStarted, setLoadStarted] = useState(false);

  useEffect(() => {
    if (!loadStarted) {
      setLoadStarted(true);
      loader()
        .then((data: Datatype) => {
          setData(data);
          setError('');
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError('Failed to get data.'); //
          setLoading(false);
        });
    }
  }, [loader, loadStarted]);

  return { loading, data, error };
}
