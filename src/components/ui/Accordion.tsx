import React, { useState } from 'react';

interface AccordionItemProps {
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItemProps[];
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.title}
            className="border border-white/10 rounded-2xl bg-slate-950/70 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-sm font-medium text-white">{item.title}</span>
              <span className="text-xs text-slate-400">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div className="px-4 pb-4 text-sm text-slate-300">{item.content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

