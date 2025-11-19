'use client';

/**
 * Tiptap Block Editor - Notion-like editor for text blocks
 * Lightweight version for block editor canvas
 */

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import { useEffect } from 'react';
import { SlashCommandsExtension } from '../slash-commands-extension';
import { slashCommands, renderSlashCommands } from '../slash-commands';

interface TiptapBlockEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

export function TiptapBlockEditor({
  content = '',
  onChange,
  placeholder = 'Type "/" for commands...',
  className = '',
  editable = true,
}: TiptapBlockEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    editable,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        horizontalRule: {
          HTMLAttributes: {
            class: 'my-2 border-t border-gray-300',
          },
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
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      SlashCommandsExtension.configure({
        suggestion: {
          items: ({ query }: any) => {
            return slashCommands.filter(item => {
              const searchTerm = query.toLowerCase();
              return (
                item.title.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm) ||
                item.searchTerms?.some(term => term.toLowerCase().includes(searchTerm))
              );
            });
          },
          render: renderSlashCommands,
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none ${className}`,
      },
    },
  });

  // Update content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className={`p-4 text-gray-400 ${className}`}>
        {placeholder}
      </div>
    );
  }

  return (
    <div className="tiptap-block-editor">
      <EditorContent editor={editor} />
    </div>
  );
}
