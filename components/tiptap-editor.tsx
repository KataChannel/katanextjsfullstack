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
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useCallback, useEffect, useState, useRef } from 'react';
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
  CheckSquare,
  Code2,
  Type,
  Palette,
  ChevronDown,
} from 'lucide-react';
import { SlashCommandsExtension } from './slash-commands-extension';
import { slashCommands, renderSlashCommands } from './slash-commands';

// Initialize lowlight for code syntax highlighting
const lowlight = createLowlight(common);

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
        codeBlock: false, // Disable default code block to use CodeBlockLowlight
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'relative rounded-lg bg-gray-900 text-gray-100 p-4 my-4 font-mono text-sm overflow-x-auto',
        },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return `Heading ${node.attrs.level}`;
          }
          return placeholder;
        },
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
      TaskList.configure({
        HTMLAttributes: {
          class: 'not-prose pl-0 my-4',
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: 'flex items-start gap-2 my-1',
        },
        nested: true,
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
      SlashCommandsExtension.configure({
        suggestion: {
          items: ({ query }: { query: string }) => {
            return slashCommands
              .filter((item) => {
                const searchText = query.toLowerCase();
                return (
                  item.title.toLowerCase().includes(searchText) ||
                  item.description.toLowerCase().includes(searchText) ||
                  item.searchTerms?.some(term => term.toLowerCase().includes(searchText))
                );
              })
              .slice(0, 10);
          },
          render: renderSlashCommands,
        },
      }),
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
        spellcheck: 'false',
      },
      handleDOMEvents: {
        keydown: (_view, event) => {
          // Cmd/Ctrl + / for slash command hint
          if ((event.metaKey || event.ctrlKey) && event.key === '/') {
            event.preventDefault();
            return true;
          }
          return false;
        },
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

  const addCodeBlock = useCallback(() => {
    if (editor) {
      editor.chain().focus().toggleCodeBlock().run();
    }
  }, [editor]);

  const addTaskList = useCallback(() => {
    if (editor) {
      editor.chain().focus().toggleTaskList().run();
    }
  }, [editor]);

  const setTextColor = useCallback((color: string) => {
    if (editor) {
      editor.chain().focus().setColor(color).run();
    }
  }, [editor]);

  const setHighlightColor = useCallback((color: string) => {
    if (editor) {
      editor.chain().focus().toggleHighlight({ color }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      {editable && (
        <MenuBar 
          editor={editor} 
          onAddLink={addLink} 
          onAddImage={addImage} 
          onAddTable={addTable}
          onAddCodeBlock={addCodeBlock}
          onAddTaskList={addTaskList}
          onSetTextColor={setTextColor}
          onSetHighlightColor={setHighlightColor}
        />
      )}
      <div className="relative">
        <EditorContent editor={editor} />
        {editable && (
          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 text-[10px] sm:text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-2 rounded-lg shadow-sm border">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="hidden xs:inline">Nhấn</span>
              <kbd className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-mono bg-muted rounded border">/</kbd>
              <span className="hidden xs:inline">để mở slash commands</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface MenuBarProps {
  editor: Editor;
  onAddLink: () => void;
  onAddImage: () => void;
  onAddTable: () => void;
  onAddCodeBlock: () => void;
  onAddTaskList: () => void;
  onSetTextColor: (color: string) => void;
  onSetHighlightColor: (color: string) => void;
}

function MenuBar({ 
  editor, 
  onAddLink, 
  onAddImage, 
  onAddTable,
  onAddCodeBlock,
  onAddTaskList,
  onSetTextColor,
  onSetHighlightColor,
}: MenuBarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  const colors = [
    { name: 'Default', value: '#000000' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Pink', value: '#ec4899' },
  ];

  const highlightColors = [
    { name: 'Yellow', value: '#fef08a' },
    { name: 'Green', value: '#bbf7d0' },
    { name: 'Blue', value: '#bfdbfe' },
    { name: 'Pink', value: '#fbcfe8' },
    { name: 'Red', value: '#fecaca' },
  ];
  return (
    <div className="border-b bg-muted/30 p-1.5 sm:p-2 flex flex-wrap gap-0.5 sm:gap-1 sticky top-0 z-10 overflow-x-auto scrollbar-hide">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`h-8 w-8 p-0 sm:h-9 sm:w-9 ${editor.isActive('bold') ? 'bg-accent' : ''}`}
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`h-8 w-8 p-0 sm:h-9 sm:w-9 ${editor.isActive('italic') ? 'bg-accent' : ''}`}
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`h-8 w-8 p-0 sm:h-9 sm:w-9 ${editor.isActive('underline') ? 'bg-accent' : ''}`}
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`h-8 w-8 p-0 sm:h-9 sm:w-9 ${editor.isActive('strike') ? 'bg-accent' : ''}`}
        title="Strikethrough"
      >
        <Strikethrough className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`h-8 w-8 p-0 sm:h-9 sm:w-9 ${editor.isActive('highlight') ? 'bg-accent' : ''}`}
        title="Highlight"
      >
        <Highlighter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`h-8 w-8 p-0 sm:h-9 sm:w-9 ${editor.isActive('code') ? 'bg-accent' : ''}`}
        title="Inline Code"
      >
        <Code className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Button>

      <div className="w-px h-5 sm:h-6 bg-border mx-0.5 sm:mx-1" />

      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`h-8 w-8 p-0 sm:h-9 sm:w-9 ${editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}`}
        title="Heading 1"
      >
        <Heading1 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`h-8 w-8 p-0 sm:h-9 sm:w-9 ${editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}`}
        title="Heading 2"
      >
        <Heading2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`h-8 w-8 p-0 sm:h-9 sm:w-9 ${editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''}`}
        title="Heading 3"
      >
        <Heading3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Button>

      <div className="w-px h-5 sm:h-6 bg-border mx-0.5 sm:mx-1" />

      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`h-8 w-8 p-0 sm:h-9 sm:w-9 ${editor.isActive('bulletList') ? 'bg-accent' : ''}`}
        title="Bullet List"
      >
        <List className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`h-8 w-8 p-0 sm:h-9 sm:w-9 ${editor.isActive('orderedList') ? 'bg-accent' : ''}`}
        title="Numbered List"
      >
        <ListOrdered className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`h-8 w-8 p-0 sm:h-9 sm:w-9 ${editor.isActive('blockquote') ? 'bg-accent' : ''}`}
        title="Quote"
      >
        <Quote className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={onAddTaskList}
        className={`h-8 w-8 p-0 sm:h-9 sm:w-9 ${editor.isActive('taskList') ? 'bg-accent' : ''}`}
        title="Task List (Checklist)"
      >
        <CheckSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Button>

      <div className="w-px h-5 sm:h-6 bg-border mx-0.5 sm:mx-1" />

      <Button 
        type="button" 
        variant="ghost" 
        onClick={onAddLink}
        className={`h-8 w-8 p-0 sm:h-9 sm:w-9 ${editor.isActive('link') ? 'bg-accent' : ''}`}
        title="Add Link (Ctrl+K)"
      >
        <Link2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Button>

      <Button 
        type="button" 
        variant="ghost" 
        onClick={onAddImage}
        className="h-8 w-8 p-0 sm:h-9 sm:w-9"
        title="Add Image"
      >
        <ImageIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Button>

      <Button 
        type="button" 
        variant="ghost" 
        onClick={onAddTable}
        className="h-8 w-8 p-0 sm:h-9 sm:w-9"
        title="Add Table"
      >
        <TableIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={onAddCodeBlock}
        className={`h-8 w-8 p-0 sm:h-9 sm:w-9 ${editor.isActive('codeBlock') ? 'bg-accent' : ''}`}
        title="Code Block"
      >
        <Code2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="h-8 w-8 p-0 sm:h-9 sm:w-9"
        title="Horizontal Rule"
      >
        <Divide className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Button>

      <div className="w-px h-5 sm:h-6 bg-border mx-0.5 sm:mx-1" />

      {/* Text Color Picker */}
      <div className="relative">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="h-8 w-8 p-0 sm:h-9 sm:w-9"
          title="Text Color"
        >
          <Type className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <ChevronDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 ml-0.5" />
        </Button>
        {showColorPicker && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-popover border rounded-lg shadow-lg z-20 flex gap-1 max-w-[calc(100vw-2rem)]">
            {colors.map((color) => (
              <button
                key={color.value}
                type="button"
                className="w-6 h-6 rounded border-2 border-transparent hover:border-primary active:scale-95 transition-all touch-none"
                style={{ backgroundColor: color.value }}
                onClick={() => {
                  onSetTextColor(color.value);
                  setShowColorPicker(false);
                }}
                onTouchStart={() => {
                  onSetTextColor(color.value);
                  setShowColorPicker(false);
                }}
                title={color.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Highlight Color Picker */}
      <div className="relative">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowHighlightPicker(!showHighlightPicker)}
          className={`h-8 w-8 p-0 sm:h-9 sm:w-9 ${editor.isActive('highlight') ? 'bg-accent' : ''}`}
          title="Highlight Color"
        >
          <Palette className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <ChevronDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 ml-0.5" />
        </Button>
        {showHighlightPicker && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-popover border rounded-lg shadow-lg z-20 flex gap-1 max-w-[calc(100vw-2rem)]">
            {highlightColors.map((color) => (
              <button
                key={color.value}
                type="button"
                className="w-6 h-6 rounded border-2 border-transparent hover:border-primary active:scale-95 transition-all touch-none"
                style={{ backgroundColor: color.value }}
                onClick={() => {
                  onSetHighlightColor(color.value);
                  setShowHighlightPicker(false);
                }}
                onTouchStart={() => {
                  onSetHighlightColor(color.value);
                  setShowHighlightPicker(false);
                }}
                title={color.name}
              />
            ))}
            <button
              type="button"
              className="w-6 h-6 rounded border-2 border-border hover:border-primary active:scale-95 transition-all flex items-center justify-center text-xs touch-none"
              onClick={() => {
                editor.chain().focus().unsetHighlight().run();
                setShowHighlightPicker(false);
              }}
              onTouchStart={() => {
                editor.chain().focus().unsetHighlight().run();
                setShowHighlightPicker(false);
              }}
              title="Clear"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="flex-1" />

      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="h-8 w-8 p-0 sm:h-9 sm:w-9"
        title="Undo (Ctrl+Z)"
      >
        <Undo className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="h-8 w-8 p-0 sm:h-9 sm:w-9"
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </Button>
    </div>
  );
}
