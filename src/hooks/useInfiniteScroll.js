import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for infinite scroll pagination
 * @param {Function} fetchFunction - Async function that fetches data. Should accept (page, limit) and return {result, pagination}
 * @param {number} limit - Items per page (default: 10)
 */
export const useInfiniteScroll = (fetchFunction, limit = 10) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const observerTarget = useRef(null);

  // Fetch data for current page
  const fetchData = useCallback(async (pageNum) => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchFunction(pageNum, limit);
      
      if (response.result && response.pagination) {
        setData(prev => pageNum === 1 ? response.result : [...prev, ...response.result]);
        
        // Check if there are more pages
        const totalPages = response.pagination.totalPage || 1;
        setHasMore(pageNum < totalPages);
        setPage(pageNum);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, limit, isLoading, hasMore]);

  // Initial fetch
  useEffect(() => {
    fetchData(1);
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchData(page + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [page, hasMore, isLoading, fetchData]);

  // Reset function to fetch fresh data
  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    fetchData(1);
  }, [fetchData]);

  return {
    data,
    isLoading,
    hasMore,
    error,
    observerTarget,
    reset,
    page
  };
};
