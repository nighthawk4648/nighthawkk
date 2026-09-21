const getData = async (path, options = {}) => {
  try {
    const fetchOptions = {
      signal: AbortSignal.timeout(10000),
      ...options,
    };
    if (!options.cache && !options.next) {
      fetchOptions.next = { revalidate: 10 };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${path}`,
      fetchOptions,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${path}:`, error.message);
    return null;
  }
};

export default getData;
