// import { useState, useEffect } from 'react';

// export function useCacheRef<T>(
//   ref: DocumentReference<T>
// ): DocumentReference<T> {
//   const [cachedRef, setCachedRef] = useState(ref);

//   useEffect(() => {
//     if (!refEqual(ref, cachedRef)) setCachedRef(ref);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [ref]);

//   return cachedRef;
// }
