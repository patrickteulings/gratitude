
export const isEmptyArray = (obj: object[]) => {
  return !obj.length && obj !== undefined && obj !== null;
};

export const isEmptyObject = (obj: object) => {
  return Object.entries(obj).length === 0 && obj.constructor === Object;
};
