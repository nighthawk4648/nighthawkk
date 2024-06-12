const getData = async (path) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${path}`);
  const data = await response.json();
  return data;
};

export default getData;