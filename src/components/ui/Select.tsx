import React from 'react';
import { ChevronDown } from 'lucide-react';
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: {
    value: string;
    label: string;
  }[];
}
export function Select({
  label,
  error,
  options,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label &&
      <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      }
      <div className="relative">
        <select
          className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors ${error ? 'border-red-500' : ''} ${className}`}
          {...props}>

          <option
            value=""
            disabled
            className="bg-slate-900 text-slate-400">

            Select an option
          </option>
          {options.map((option) =>
          <option
            key={option.value}
            value={option.value}
            className="bg-slate-900 text-white">

              {option.label}
            </option>
          )}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>);

}