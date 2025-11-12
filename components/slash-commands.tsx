import { Editor, Range } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import tippy, { Instance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code2,
  Image,
  Table,
  Divide,
  Type,
} from 'lucide-react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

export interface SlashCommandItem {
  title: string;
  description: string;
  icon: any;
  command: ({ editor, range }: { editor: Editor; range: Range }) => void;
  searchTerms?: string[];
}

export const slashCommands: SlashCommandItem[] = [
  {
    title: 'Text',
    description: 'Văn bản thường',
    icon: Type,
    searchTerms: ['text', 'paragraph', 'p', 'văn bản'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setParagraph().run();
    },
  },
  {
    title: 'Heading 1',
    description: 'Tiêu đề lớn',
    icon: Heading1,
    searchTerms: ['h1', 'heading1', 'title', 'tiêu đề'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
    },
  },
  {
    title: 'Heading 2',
    description: 'Tiêu đề trung bình',
    icon: Heading2,
    searchTerms: ['h2', 'heading2', 'subtitle', 'tiêu đề'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run();
    },
  },
  {
    title: 'Heading 3',
    description: 'Tiêu đề nhỏ',
    icon: Heading3,
    searchTerms: ['h3', 'heading3', 'tiêu đề'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run();
    },
  },
  {
    title: 'Bullet List',
    description: 'Danh sách không đánh số',
    icon: List,
    searchTerms: ['ul', 'bullet', 'list', 'danh sách'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: 'Numbered List',
    description: 'Danh sách có đánh số',
    icon: ListOrdered,
    searchTerms: ['ol', 'ordered', 'numbered', 'list', 'danh sách', 'số'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: 'Task List',
    description: 'Danh sách công việc với checkbox',
    icon: CheckSquare,
    searchTerms: ['task', 'todo', 'checkbox', 'check', 'công việc'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: 'Quote',
    description: 'Trích dẫn',
    icon: Quote,
    searchTerms: ['quote', 'blockquote', 'trích dẫn'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: 'Code Block',
    description: 'Khối code với syntax highlighting',
    icon: Code2,
    searchTerms: ['code', 'codeblock', 'pre', 'programming', 'lập trình'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: 'Divider',
    description: 'Đường kẻ phân cách',
    icon: Divide,
    searchTerms: ['divider', 'hr', 'horizontal', 'line', 'đường kẻ'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
  {
    title: 'Table',
    description: 'Thêm bảng 3x3',
    icon: Table,
    searchTerms: ['table', 'grid', 'bảng'],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    },
  },
  {
    title: 'Image',
    description: 'Thêm hình ảnh từ URL',
    icon: Image,
    searchTerms: ['image', 'img', 'picture', 'photo', 'hình ảnh'],
    command: ({ editor, range }) => {
      const url = window.prompt('Nhập URL hình ảnh:');
      if (url) {
        editor.chain().focus().deleteRange(range).setImage({ src: url }).run();
      }
    },
  },
];

interface SlashCommandsListProps {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
}

export const SlashCommandsList = forwardRef<any, SlashCommandsListProps>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      const item = props.items[index];
      if (item) {
        props.command(item);
      }
    };

    const upHandler = () => {
      setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === 'ArrowUp') {
          upHandler();
          return true;
        }

        if (event.key === 'ArrowDown') {
          downHandler();
          return true;
        }

        if (event.key === 'Enter') {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    return (
      <div className="z-50 w-[calc(100vw-2rem)] sm:w-80 max-w-md rounded-lg border bg-popover p-2 shadow-md">
        <div className="text-xs font-medium text-muted-foreground px-2 py-1.5 border-b mb-1">
          💡 Slash Commands
        </div>
        <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto overflow-x-hidden">
          {props.items.length ? (
            props.items.map((item, index) => (
              <button
                key={index}
                type="button"
                className={`flex w-full items-start gap-2 sm:gap-3 rounded-md px-2 py-2.5 text-left text-sm hover:bg-accent transition-colors touch-manipulation ${
                  index === selectedIndex ? 'bg-accent shadow-sm' : ''
                }`}
                onClick={() => selectItem(index)}
                onTouchStart={() => selectItem(index)}
              >
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md border bg-background">
                  <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm sm:text-base truncate">{item.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {item.description}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="px-2 py-8 text-center text-sm text-muted-foreground">
              <div className="text-2xl mb-2">🔍</div>
              <div>Không tìm thấy lệnh</div>
              <div className="text-xs mt-1">Thử từ khóa khác</div>
            </div>
          )}
        </div>
        <div className="text-xs text-muted-foreground px-2 py-1.5 border-t mt-1 hidden sm:block">
          <span className="opacity-60">↑↓ Di chuyển • Enter Chọn • Esc Đóng</span>
        </div>
      </div>
    );
  }
);

SlashCommandsList.displayName = 'SlashCommandsList';

export function renderSlashCommands() {
  let component: ReactRenderer | null = null;
  let popup: Instance[] | null = null;

  return {
    onStart: (props: any) => {
      component = new ReactRenderer(SlashCommandsList, {
        props,
        editor: props.editor,
      });

      if (!props.clientRect) {
        return;
      }

      popup = tippy('body', {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
      });
    },

    onUpdate(props: any) {
      component?.updateProps(props);

      if (!props.clientRect) {
        return;
      }

      popup?.[0]?.setProps({
        getReferenceClientRect: props.clientRect,
      });
    },

    onKeyDown(props: any) {
      if (props.event.key === 'Escape') {
        popup?.[0]?.hide();
        return true;
      }

      // @ts-ignore
      return component?.ref?.onKeyDown?.(props);
    },

    onExit() {
      popup?.[0]?.destroy();
      component?.destroy();
    },
  };
}
