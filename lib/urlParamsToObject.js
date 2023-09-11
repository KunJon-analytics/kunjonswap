const urlParamsToObject = (params) => {
  const obj = {};

  for (const [key, value] of params) {
    if (obj.hasOwnProperty(key)) {
      if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }
  }

  return obj;
};

export default urlParamsToObject;
