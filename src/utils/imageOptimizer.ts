export const optimizeImage = (
  path: string, 
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png' | 'avif';
  } = {}
) => {
  if (!path || !path.startsWith('/')) return path;
  
  const { width, height, quality = 85, format = 'webp' } = options;
  const params = new URLSearchParams();
  
  if (width) params.append('width', width.toString());
  if (height) params.append('height', height.toString());
  params.append('quality', quality.toString());
  params.append('format', format);
  
  return `${path}?${params.toString()}`;
};