import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface EmailEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function EmailEditor({ value, onChange }: EmailEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border rounded-md p-4 min-h-[200px]">
      <EditorContent editor={editor} className="prose max-w-none" />
    </div>
  );
}