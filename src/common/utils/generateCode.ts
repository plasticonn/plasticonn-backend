export const generateCenterId = () => {
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `C-${random}`;
};

export const generateDropId = () => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `D-${random}`;
};
