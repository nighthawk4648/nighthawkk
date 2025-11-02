const getData = async (path) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${path}`, {
      cache: 'no-cache',
      next: { revalidate: 60 }, // Cache for 60 seconds
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
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