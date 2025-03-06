import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { CompileMDXResult } from './types';
import { FrontMatter } from '../../types/mdx';

export async function compileMDX(source: string): Promise<CompileMDXResult> {
  // Extract frontmatter
  const frontMatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = source.match(frontMatterRegex);
  
  let frontMatter: FrontMatter = {
    title: '',
    date: '',
    slug: '',
    excerpt: ''
  };
  
  let mdxContent = source;
  
  if (match) {
    // Parse frontmatter
    const frontMatterString = match[1];
    const frontMatterLines = frontMatterString.split('\n');
    
    frontMatterLines.forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        const key = line.slice(0, colonIndex).trim();
        const value = line.slice(colonIndex + 1).trim().replace(/^['"](.*)['"]$/, '$1');
        frontMatter[key] = value;
      }
    });
    
    // Remove frontmatter from content
    mdxContent = source.replace(match[0], '');
  }
  
  // Compile MDX
  const result = await evaluate(mdxContent, {
    ...runtime,
    development: process.env.NODE_ENV === 'development'
  });
  
  return {
    Component: result.default,
    frontMatter
  };
}