import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';

interface CodeBlockProps {
  children: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ children, className }) => {
  // Extract language from className (e.g., "language-javascript")
  const language = className?.replace(/language-/, '') || '';
  
  return (
    <Highlight
      theme={themes.github}
      code={children.trim()}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={`${className} p-4 rounded overflow-auto`} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line })} key={i}>
              <span className="inline-block w-6 text-right opacity-50 mr-4">{i + 1}</span>
              {line.map((token, key) => (
                <span {...getTokenProps({ token })} key={key} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};