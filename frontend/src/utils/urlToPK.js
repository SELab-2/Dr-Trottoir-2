export const urlToPK = (url) => {
  const regex = /\/(\d+)\/$/;
  const match = url.match(regex);
  if (match !== null) {
    const primaryKey = match[1];
    return primaryKey;
  }
};
