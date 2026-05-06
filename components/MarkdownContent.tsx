'use client';

import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

export const markdownComponents: Components = {
  p: ({ children }) => (
    <p className="mb-3 last:mb-0 text-gray-800 leading-relaxed">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="my-3 list-disc pl-6 text-gray-800 space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-3 list-decimal pl-6 text-gray-800 space-y-1">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-blue-600 hover:text-blue-800 underline underline-offset-2"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="rounded bg-gray-200/80 px-1.5 py-0.5 text-sm font-mono text-gray-900"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className={`${className} block text-sm font-mono text-gray-900`}
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-3 overflow-x-auto rounded-lg border border-gray-200 bg-gray-100 p-3">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-4 border-gray-300 pl-4 text-gray-700 italic">
      {children}
    </blockquote>
  ),
  h1: ({ children }) => (
    <h1 className="mb-2 mt-4 text-xl font-bold text-gray-900 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 mt-4 text-lg font-bold text-gray-900 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-3 text-base font-semibold text-gray-900 first:mt-0">
      {children}
    </h3>
  ),
  hr: () => <hr className="my-4 border-gray-200" />,
};

type MarkdownContentProps = {
  source: string;
  className?: string;
};

export function MarkdownContent({ source, className = '' }: MarkdownContentProps) {
  return (
    <div
      className={`markdown-response text-gray-800 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 ${className}`.trim()}
    >
      <ReactMarkdown components={markdownComponents}>{source}</ReactMarkdown>
    </div>
  );
}
