const getData = async (path) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${path}`, {

      cache: 'no-cache'
    });
    if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
} catch (error) {
  console.error('Error fetching data:', error);
  return null;
}
};

export default getData;