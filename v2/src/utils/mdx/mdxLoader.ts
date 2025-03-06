import { promises as fs } from 'fs';
import path from 'path';
import { MDXContent, FrontMatter } from '../../types/mdx';
import { compileMDX } from './compileMDX';

export async function getAllMdx(contentDir: string): Promise<MDXContent[]> {
  try {
    const files = await fs.readdir(contentDir);
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));
    
    const mdxContents = await Promise.all(
      mdxFiles.map(async (file) => {
        const filePath = path.join(contentDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        
        const { Component, frontMatter } = await compileMDX(content);
        
        return {
          frontMatter: frontMatter as FrontMatter,
          slug: frontMatter.slug || file.replace('.mdx', ''),
          content: Component,
        };
      })
    );
    
    // Sort by date (most recent first)
    return mdxContents.sort((a, b) => {
      return new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime();
    });
  } catch (error) {
    console.error('Error loading MDX files:', error);
    return [];
  }
}

export async function getMdxBySlug(contentDir: string, slug: string): Promise<MDXContent | null> {
  try {
    const files = await fs.readdir(contentDir);
    const mdxFile = files.find(file => 
      file === `${slug}.mdx` || 
      file.replace('.mdx', '') === slug
    );
    
    if (!mdxFile) {
      return null;
    }
    
    const filePath = path.join(contentDir, mdxFile);
    const content = await fs.readFile(filePath, 'utf8');
    
    const { Component, frontMatter } = await compileMDX(content);
    
    return {
      frontMatter: frontMatter as FrontMatter,
      slug,
      content: Component,
    };
  } catch (error) {
    console.error(`Error loading MDX file for slug ${slug}:`, error);
    return null;
  }
}