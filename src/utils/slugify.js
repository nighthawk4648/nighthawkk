const slugify = (text = 'unnamed') => {
    // replace spaces with dashes
    // replace special characters with dashes
    // replace multiple dashes with one
    // remove dashes from start and end of string
    // make all lowercase
    // replace slash with dashes
  
    return text
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
      .toLowerCase()
      .replace(/\//g, '-');
  };
  
  export default slugify;