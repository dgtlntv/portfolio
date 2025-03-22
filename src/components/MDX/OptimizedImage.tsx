import React from 'react';
import { optimizeImage } from '../../utils/imageOptimizer';

export const OptimizedImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
  src,
  alt,
  width,
  height,
  ...props
}) => {
  const optimizedSrc = src ? optimizeImage(src, { 
    width: typeof width === 'number' ? width : undefined,
    height: typeof height === 'number' ? height : undefined,
    // Default to width 1200 for MDX content images if no width specified
    ...(typeof width !== 'number' && { width: 1200 })
  }) : src;
  
  return <img src={optimizedSrc} alt={alt} width={width} height={height} {...props} />;
};