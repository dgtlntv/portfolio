import React from 'react'

interface TagListProps {
  tags: string[]
  className?: string
}

export const TagList: React.FC<TagListProps> = ({ tags, className = '' }) => {
  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => (
        <span 
          key={index} 
          className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}