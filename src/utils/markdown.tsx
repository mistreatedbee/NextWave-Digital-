import React from 'react';

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  const lines = content.split('\n');

  const elements: React.ReactNode[] = [];
  let buffer: string[] = [];

  const flushParagraph = () => {
    const text = buffer.join(' ').trim();
    if (!text) return;
    elements.push(
      <p key={elements.length} className="text-slate-200 leading-relaxed mb-4">
        {text}
      </p>,
    );
    buffer = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      return;
    }

    if (trimmed.startsWith('# ')) {
      flushParagraph();
      elements.push(
        <h2 key={elements.length} className="text-2xl font-bold text-white mt-6 mb-3">
          {trimmed.replace(/^#\s+/, '')}
        </h2>,
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushParagraph();
      elements.push(
        <h3 key={elements.length} className="text-xl font-semibold text-white mt-5 mb-2">
          {trimmed.replace(/^##\s+/, '')}
        </h3>,
      );
      return;
    }

    if (trimmed.startsWith('- ')) {
      flushParagraph();
      const items: string[] = [];
      items.push(trimmed.replace(/^- /, ''));
      elements.push(
        <ul key={elements.length} className="list-disc list-inside text-slate-200 mb-3 space-y-1">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>,
      );
      return;
    }

    buffer.push(trimmed);
  });

  flushParagraph();

  return <div>{elements}</div>;
}

