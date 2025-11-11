import { BuilderElement } from './store';
import { layoutPropsToTailwind } from './layout-engine';
import { animationToTailwind, generateScrollTriggerScript, generateScrollAnimationCSS } from './animations';

/**
 * Export HTML + Tailwind CSS
 * Clean export without runtime JS (chỉ có animation script nếu cần)
 */

/**
 * Convert StyleProps thành inline CSS
 */
function stylePropsToCSS(element: BuilderElement): string {
  const { style } = element;
  const css: string[] = [];

  if (style.backgroundColor) css.push(`background-color: ${style.backgroundColor}`);
  if (style.color) css.push(`color: ${style.color}`);
  if (style.fontSize) css.push(`font-size: ${style.fontSize}px`);
  if (style.fontWeight) css.push(`font-weight: ${style.fontWeight}`);
  if (style.borderRadius) css.push(`border-radius: ${style.borderRadius}px`);
  if (style.border) css.push(`border: ${style.border}`);
  if (style.boxShadow) css.push(`box-shadow: ${style.boxShadow}`);
  if (style.opacity !== undefined) css.push(`opacity: ${style.opacity}`);

  return css.join('; ');
}

/**
 * Convert states thành CSS classes
 */
function generateStateCSS(element: BuilderElement): string {
  const { states, id } = element;
  let css = '';

  if (states.hover) {
    css += `
      .el-${id}:hover {
        ${Object.entries(states.hover)
          .map(([key, value]) => {
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${cssKey}: ${value}`;
          })
          .join('; ')}
      }
    `;
  }

  if (states.focus) {
    css += `
      .el-${id}:focus {
        ${Object.entries(states.focus)
          .map(([key, value]) => {
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${cssKey}: ${value}`;
          })
          .join('; ')}
      }
    `;
  }

  if (states.active) {
    css += `
      .el-${id}:active {
        ${Object.entries(states.active)
          .map(([key, value]) => {
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${cssKey}: ${value}`;
          })
          .join('; ')}
      }
    `;
  }

  return css;
}

/**
 * Convert element thành HTML string
 */
function elementToHTML(element: BuilderElement): string {
  const layoutClasses = layoutPropsToTailwind(element.layout);
  const animationClasses = animationToTailwind(element.animation);
  const dataAnimate =
    element.animation.type !== 'none' && element.animation.trigger === 'scroll'
      ? `data-animate="${element.animation.type}"`
      : '';

  const classNames = [
    `el-${element.id}`,
    layoutClasses,
    animationClasses,
  ]
    .filter(Boolean)
    .join(' ');

  const inlineStyle = stylePropsToCSS(element);

  switch (element.type) {
    case 'container':
      return `
        <div
          class="${classNames}"
          style="${inlineStyle}"
          ${dataAnimate}
        >
          ${element.children?.map((childId) => '<!-- Child element -->').join('') || ''}
        </div>
      `;

    case 'heading':
      return `
        <h2
          class="${classNames}"
          style="${inlineStyle}"
          ${dataAnimate}
        >
          ${element.content || ''}
        </h2>
      `;

    case 'text':
      return `
        <p
          class="${classNames}"
          style="${inlineStyle}"
          ${dataAnimate}
        >
          ${element.content || ''}
        </p>
      `;

    case 'button':
      return `
        <button
          class="${classNames}"
          style="${inlineStyle}"
          ${dataAnimate}
        >
          ${element.content || ''}
        </button>
      `;

    case 'image':
      return `
        <img
          src="${element.src || '/placeholder.jpg'}"
          alt="${element.name}"
          class="${classNames}"
          style="${inlineStyle}"
          ${dataAnimate}
        />
      `;

    default:
      return '';
  }
}

/**
 * Export toàn bộ canvas thành HTML file
 */
export function exportToHTML(elements: Record<string, BuilderElement>): string {
  const elementsList = Object.values(elements);

  // Generate custom CSS cho states
  const customCSS = elementsList
    .map((el) => generateStateCSS(el))
    .filter(Boolean)
    .join('\n');

  // Generate HTML cho tất cả elements
  const bodyHTML = elementsList
    .map((el) => elementToHTML(el))
    .join('\n');

  // Check if any element has scroll animation
  const hasScrollAnimation = elementsList.some(
    (el) => el.animation.type !== 'none' && el.animation.trigger === 'scroll'
  );

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Builder Export</title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Custom CSS -->
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    ${customCSS}
  </style>

  ${hasScrollAnimation ? generateScrollAnimationCSS() : ''}
</head>
<body>
  ${bodyHTML}

  ${hasScrollAnimation ? generateScrollTriggerScript() : ''}
</body>
</html>
  `.trim();

  return html;
}

/**
 * Download HTML file
 */
export function downloadHTML(html: string, filename: string = 'page.html'): void {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy HTML to clipboard
 */
export async function copyHTMLToClipboard(html: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(html);
  } catch (err) {
    console.error('Failed to copy HTML:', err);
    throw err;
  }
}
