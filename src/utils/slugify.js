const slugify = (text = "unnamed") => {
  if (!text || typeof text !== "string") return "unnamed";

  return text
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .toLowerCase()
    .replace(/\//g, "-");
};

export default slugify;
