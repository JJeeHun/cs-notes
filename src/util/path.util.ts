export const getNormalizedPath = (filePath: string) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const normalizedPath = filePath.startsWith("/") ? filePath : `/${filePath}`;
  return `${base}${normalizedPath}`;
};
