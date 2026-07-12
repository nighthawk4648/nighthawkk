// another fetcher for data fetching 
export const fetcher = (...args) => fetch(...args).then((res) => res.json());