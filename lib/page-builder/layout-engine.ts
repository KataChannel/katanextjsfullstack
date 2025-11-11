import Yoga from 'yoga-wasm-web';
import { LayoutProps } from './store';

/**
 * Layout Engine sử dụng Yoga WASM
 * Chuyển đổi Flex/Grid properties thành Tailwind classes
 */

let yogaInstance: Awaited<ReturnType<typeof Yoga>> | null = null;

/**
 * Initialize Yoga WASM
 */
export async function initYoga() {
  if (!yogaInstance) {
    yogaInstance = await Yoga({} as any);
  }
  return yogaInstance;
}

/**
 * Convert layout props thành Tailwind classes
 */
export function layoutPropsToTailwind(layout: LayoutProps): string {
  const classes: string[] = [];

  // Display
  if (layout.display) {
    if (layout.display === 'flex') {
      classes.push('flex');
    } else if (layout.display === 'grid') {
      classes.push('grid');
    } else if (layout.display === 'block') {
      classes.push('block');
    } else if (layout.display === 'inline-block') {
      classes.push('inline-block');
    }
  }

  // Flex Direction
  if (layout.flexDirection) {
    const directionMap = {
      'row': 'flex-row',
      'column': 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse',
    };
    classes.push(directionMap[layout.flexDirection]);
  }

  // Justify Content
  if (layout.justifyContent) {
    const justifyMap = {
      'start': 'justify-start',
      'center': 'justify-center',
      'end': 'justify-end',
      'between': 'justify-between',
      'around': 'justify-around',
      'evenly': 'justify-evenly',
    };
    classes.push(justifyMap[layout.justifyContent]);
  }

  // Align Items
  if (layout.alignItems) {
    const alignMap = {
      'start': 'items-start',
      'center': 'items-center',
      'end': 'items-end',
      'stretch': 'items-stretch',
      'baseline': 'items-baseline',
    };
    classes.push(alignMap[layout.alignItems]);
  }

  // Gap (assuming 4px base unit)
  if (layout.gap !== undefined) {
    const gapValue = Math.round(layout.gap / 4);
    classes.push(`gap-${gapValue}`);
  }

  // Padding
  if (layout.padding !== undefined) {
    const paddingValue = Math.round(layout.padding / 4);
    classes.push(`p-${paddingValue}`);
  }

  // Margin
  if (layout.margin !== undefined) {
    const marginValue = Math.round(layout.margin / 4);
    classes.push(`m-${marginValue}`);
  }

  // Width
  if (layout.width) {
    if (layout.width === 'auto') {
      classes.push('w-auto');
    } else if (layout.width === '100%') {
      classes.push('w-full');
    } else if (layout.width.endsWith('%')) {
      const percentValue = parseInt(layout.width);
      if (percentValue === 50) classes.push('w-1/2');
      else if (percentValue === 33) classes.push('w-1/3');
      else if (percentValue === 25) classes.push('w-1/4');
      else classes.push(`w-[${layout.width}]`);
    } else {
      classes.push(`w-[${layout.width}]`);
    }
  }

  // Height
  if (layout.height) {
    if (layout.height === 'auto') {
      classes.push('h-auto');
    } else if (layout.height === '100%') {
      classes.push('h-full');
    } else {
      classes.push(`h-[${layout.height}]`);
    }
  }

  // Grid Columns
  if (layout.gridColumns) {
    classes.push(`grid-cols-${layout.gridColumns}`);
  }

  // Grid Rows
  if (layout.gridRows) {
    classes.push(`grid-rows-${layout.gridRows}`);
  }

  return classes.join(' ');
}

/**
 * Calculate layout using Yoga
 */
export async function calculateLayout(
  width: number,
  height: number,
  layout: LayoutProps
): Promise<{ x: number; y: number; width: number; height: number }> {
  const yoga = await initYoga();
  const node = yoga.Node.create();

  // Set flex properties
  if (layout.display === 'flex') {
    node.setFlexDirection(
      layout.flexDirection === 'column'
        ? yoga.FLEX_DIRECTION_COLUMN
        : yoga.FLEX_DIRECTION_ROW
    );

    if (layout.justifyContent) {
      const justifyMap = {
        'start': yoga.JUSTIFY_FLEX_START,
        'center': yoga.JUSTIFY_CENTER,
        'end': yoga.JUSTIFY_FLEX_END,
        'between': yoga.JUSTIFY_SPACE_BETWEEN,
        'around': yoga.JUSTIFY_SPACE_AROUND,
        'evenly': yoga.JUSTIFY_SPACE_EVENLY,
      };
      node.setJustifyContent(justifyMap[layout.justifyContent]);
    }

    if (layout.alignItems) {
      const alignMap = {
        'start': yoga.ALIGN_FLEX_START,
        'center': yoga.ALIGN_CENTER,
        'end': yoga.ALIGN_FLEX_END,
        'stretch': yoga.ALIGN_STRETCH,
        'baseline': yoga.ALIGN_BASELINE,
      };
      node.setAlignItems(alignMap[layout.alignItems]);
    }
  }

  // Set dimensions
  node.setWidth(width);
  node.setHeight(height);

  // Set padding
  if (layout.padding !== undefined) {
    node.setPadding(yoga.EDGE_ALL, layout.padding);
  }

  // Set margin
  if (layout.margin !== undefined) {
    node.setMargin(yoga.EDGE_ALL, layout.margin);
  }

  // Calculate layout
  node.calculateLayout(width, height, yoga.DIRECTION_LTR);

  const result = {
    x: node.getComputedLeft(),
    y: node.getComputedTop(),
    width: node.getComputedWidth(),
    height: node.getComputedHeight(),
  };

  // Free node
  node.free();

  return result;
}
