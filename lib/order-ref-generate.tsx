export const orderRefGenerate = () => {
  const date = new Date();
  const datePart = date.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 chars random string
  return `MKP-${datePart}-${randomPart}`;
};
