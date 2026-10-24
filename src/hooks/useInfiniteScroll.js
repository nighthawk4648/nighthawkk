import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for infinite scroll pagination
 * @param {Function} fetchFunction - Async function that fetches data. Should accept (page, limit) and return {result, pagination}
 * @param {number} limit - Items per page (default: 10)
 */
export const useInfiniteScroll = (fetchFunction, limit = 10, initialData = null) => {
  const [data, setData] = useState(initialData?.result || []);
  const [page, setPage] = useState(initialData?.pagination?.currentPage || 1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    initialData?.pagination
      ? (initialData.pagination.currentPage < (initialData.pagination.totalPage || 1))
      : true
  );
  const [error, setError] = useState(null);
  const observerTarget = useRef(null);
  const initialFetchDone = useRef(Boolean(initialData?.result && initialData.result.length > 0));

  // In-flight request lock and latest state refs to prevent concurrent duplicate calls and stale closures
  const isFetchingRef = useRef(false);
  const pageRef = useRef(page);
  const hasMoreRef = useRef(hasMore);

  pageRef.current = page;
  hasMoreRef.current = hasMore;

  // Fetch data for current page with in-flight locking and ID deduplication
  const fetchData = useCallback(async (pageNum) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchFunction(pageNum, limit);
      
      if (response && response.result && response.pagination) {
        setData(prev => {
          if (pageNum === 1) return response.result;
          const existingIds = new Set(prev.map(item => item?.id));
          const uniqueNew = response.result.filter(item => item && !existingIds.has(item.id));
          return [...prev, ...uniqueNew];
        });
        
        // Check if there are more pages
        const totalPages = response.pagination.totalPage || 1;
        const nextHasMore = pageNum < totalPages;
        setHasMore(nextHasMore);
        hasMoreRef.current = nextHasMore;
        setPage(pageNum);
        pageRef.current = pageNum;
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }, [fetchFunction, limit]);

  // Fetch all remaining pages for comprehensive search scope
  const fetchAllRemaining = useCallback(async () => {
    if (isFetchingRef.current || !hasMoreRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      let currentPageNum = pageRef.current + 1;
      let keepFetching = true;

      while (keepFetching) {
        const response = await fetchFunction(currentPageNum, limit);
        if (response?.result && response?.pagination) {
          setData(prev => {
            const existingIds = new Set(prev.map(item => item?.id));
            const uniqueNew = response.result.filter(item => item && !existingIds.has(item.id));
            return [...prev, ...uniqueNew];
          });

          const totalPages = response.pagination.totalPage || 1;
          if (currentPageNum >= totalPages || response.result.length === 0) {
            keepFetching = false;
            setHasMore(false);
            hasMoreRef.current = false;
            setPage(totalPages);
            pageRef.current = totalPages;
          } else {
            currentPageNum += 1;
          }
        } else {
          keepFetching = false;
        }
      }
    } catch (err) {
      console.error('Error fetching all remaining items:', err);
      setError(err.message || 'Failed to fetch all items');
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }, [fetchFunction, limit]);

  // Initial fetch
  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchData(1);
    }
  }, [fetchData]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isFetchingRef.current) {
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
    pageRef.current = 1;
    setHasMore(true);
    hasMoreRef.current = true;
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
    page,
    fetchAllRemaining,
  };
};
