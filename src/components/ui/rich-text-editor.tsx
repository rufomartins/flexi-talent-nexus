import React from 'react';
import { Bold, Italic, Link, List, Quote, Code } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  error?: string;
}

export const RichTextEditor = ({ value, onChange, label, error }: RichTextEditorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className={`border rounded-lg ${error ? 'border-red-500' : ''}`}>
        <div className="flex items-center border-b p-2 space-x-2 flex-wrap">
          <button type="button" className="p-1 hover:bg-gray-100 rounded" title="Bold">
            <Bold className="w-4 h-4" />
          </button>
          <button type="button" className="p-1 hover:bg-gray-100 rounded" title="Italic">
            <Italic className="w-4 h-4" />
          </button>
          <button type="button" className="p-1 hover:bg-gray-100 rounded" title="Link">
            <Link className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-gray-300 mx-2" />
          <button type="button" className="p-1 hover:bg-gray-100 rounded" title="Bullet List">
            <List className="w-4 h-4" />
          </button>
          <button type="button" className="p-1 hover:bg-gray-100 rounded" title="Numbered List">
            <span className="text-sm">1.</span>
          </button>
          <button type="button" className="p-1 hover:bg-gray-100 rounded" title="Quote">
            <Quote className="w-4 h-4" />
          </button>
          <button type="button" className="p-1 hover:bg-gray-100 rounded" title="Code">
            <Code className="w-4 h-4" />
          </button>
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 min-h-[200px] focus:outline-none resize-none"
          placeholder="Enter text here..."
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};