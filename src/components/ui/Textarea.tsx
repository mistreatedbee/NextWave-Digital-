import React from 'react';
interface TextareaProps extends
  React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}
export function Textarea({
  label,
  error,
  className = '',
  ...props
}: TextareaProps) {
  return (
    <div className="w-full">
      {label &&
      <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      }
      <textarea
        className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors min-h-[120px] resize-y ${error ? 'border-red-500' : ''} ${className}`}
        {...props} />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>);

}