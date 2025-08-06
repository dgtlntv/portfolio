import React from 'react';

interface DocumentSkeletonProps {
  lines?: number;
  className?: string;
  title?: string;
}

export default function DocumentSkeleton({ lines = 12, className = "", title }: DocumentSkeletonProps) {
  const generateLines = () => {
    const lineElements = [];
    
    for (let i = 0; i < lines; i++) {
      const isShort = Math.random() < 0.2;
      const isMedium = Math.random() < 0.3;
      const isTitle = !title && (i === 0 || (i > 0 && Math.random() < 0.15));
      
      let lineClass = "h-3 bg-gray-300 rounded";
      let width = "w-full";
      
      if (isTitle) {
        lineClass = "h-6 bg-gray-400 rounded";
        width = Math.random() < 0.5 ? "w-3/4" : "w-2/3";
      } else if (isShort) {
        width = "w-3/5";
      } else if (isMedium) {
        width = "w-4/5";
      }
      
      lineElements.push(
        <div
          key={i}
          className={`${lineClass} ${width} ${isTitle ? 'mb-4' : 'mb-3'}`}
        />
      );
      
      if (isTitle && i > 0) {
        lineElements.push(
          <div key={`space-${i}`} className="mb-2" />
        );
      }
    }
    
    return lineElements;
  };

  return (
    <div className={`not-prose bg-white border border-gray-200 shadow-sm aspect-[1/1.414] max-w-sm mx-auto rounded-lg rotate-2 ${className}`}>
      <div className="h-full flex flex-col p-8">
        {/* Fixed header content */}
        <div className="flex-shrink-0">
          {title && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            </div>
          )}
          
          {/* Document metadata table */}
          <div className="mb-8 border border-gray-200 rounded text-[10px] divide-y divide-gray-200">
            <div className="flex px-2 py-1">
              <span className="w-12 text-gray-500 font-medium">Author:</span>
              <span className="text-gray-800">Design Team</span>
            </div>
            <div className="flex px-2 py-1">
              <span className="w-12 text-gray-500 font-medium">Date:</span>
              <span className="text-gray-800">March 2024</span>
            </div>
            <div className="flex px-2 py-1">
              <span className="w-12 text-gray-500 font-medium">Version:</span>
              <span className="text-gray-800">2.1</span>
            </div>
            <div className="flex px-2 py-1">
              <span className="w-12 text-gray-500 font-medium">Status:</span>
              <span className="text-gray-800">Final</span>
            </div>
          </div>
        </div>
        
        {/* Scrollable content area with gradient fade */}
        <div className="flex-1 relative min-h-0">
          <div className="h-full overflow-y-auto space-y-3">
            {generateLines()}
          </div>
          {/* Gradient fade overlay */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}