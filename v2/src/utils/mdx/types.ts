import { FrontMatter, MDXContent } from '../../types/mdx';

export interface CompileMDXResult {
  Component: React.ComponentType;
  frontMatter: FrontMatter;
}