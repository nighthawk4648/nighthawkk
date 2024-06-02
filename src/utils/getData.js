const getData = async (path) => {
  const response = await fetch(`http://localhost:5000/api/${path}`);
  const data = await response.json();
  return data;
};

export default getData;