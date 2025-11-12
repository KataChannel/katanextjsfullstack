'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import { useCallback, useEffect } from 'react';
import { Button } from './ui/button';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Link2,
  Image as ImageIcon,
  Table as TableIcon,
  Undo,
  Redo,
  Underline as UnderlineIcon,
  Highlighter,
  Divide,
} from 'lucide-react';

interface TiptapEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  editable?: boolean;
  placeholder?: string;
}

export function TiptapEditor({
  content = '',
  onChange,
  editable = true,
  placeholder = 'Bắt đầu viết nội dung...',
}: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        horizontalRule: {
          HTMLAttributes: {
            class: 'my-4 border-t-2 border-gray-300',
          },
        },
      }),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer hover:text-blue-700',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4',
        },
      }),
      TableRow,
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 px-4 py-2',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 px-4 py-2 bg-gray-100 font-semibold',
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: 'bg-yellow-200 px-1',
        },
      }),
      Underline,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[300px] p-4 border-none outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const addLink = useCallback(() => {
    const url = window.prompt('Nhập URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('Nhập URL hình ảnh:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addTable = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      {editable && <MenuBar editor={editor} onAddLink={addLink} onAddImage={addImage} onAddTable={addTable} />}
      <div className="min-h-[400px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

interface MenuBarProps {
  editor: Editor;
  onAddLink: () => void;
  onAddImage: () => void;
  onAddTable: () => void;
}

function MenuBar({ editor, onAddLink, onAddImage, onAddTable }: MenuBarProps) {
  return (
    <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-accent' : ''}
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-accent' : ''}
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'bg-accent' : ''}
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'bg-accent' : ''}
        title="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={editor.isActive('highlight') ? 'bg-accent' : ''}
        title="Highlight"
      >
        <Highlighter className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'bg-accent' : ''}
        title="Inline Code"
      >
        <Code className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''}
        title="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-accent' : ''}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-accent' : ''}
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'bg-accent' : ''}
        title="Quote"
      >
        <Quote className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={onAddLink}
        title="Add Link"
      >
        <Link2 className="h-4 w-4" />
      </Button>

      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={onAddImage}
        title="Add Image"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>

      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={onAddTable}
        title="Add Table"
      >
        <TableIcon className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
      >
        <Divide className="h-4 w-4" />
      </Button>

      <div className="flex-1" />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo (Ctrl+Z)"
      >
        <Undo className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
}
