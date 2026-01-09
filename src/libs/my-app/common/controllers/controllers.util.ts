export const normalizePath = (path: string) => {
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  return path;
};
