import { AnimationProps } from './store';

/**
 * Animation utilities với Framer Motion
 * Hỗ trợ fade, slide, scale animations
 */

export type AnimationType = 'fade' | 'slide' | 'scale' | 'none';
export type TriggerType = 'scroll' | 'hover' | 'click' | 'load';

/**
 * Generate Framer Motion variants cho animation
 */
export function getAnimationVariants(animation: AnimationProps) {
  const { type = 'none', duration = 0.3, delay = 0 } = animation;

  const transition = {
    duration,
    delay,
    ease: 'easeInOut',
  };

  switch (type) {
    case 'fade':
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition,
      };

    case 'slide':
      return {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition,
      };

    case 'scale':
      return {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
        transition,
      };

    case 'none':
    default:
      return {
        initial: {},
        animate: {},
        exit: {},
        transition: { duration: 0 },
      };
  }
}

/**
 * Convert animation thành inline CSS cho export
 */
export function animationToCSS(animation: AnimationProps): string {
  const { type = 'none', duration = 0.3, trigger = 'scroll' } = animation;

  if (type === 'none' || trigger === 'click') {
    return '';
  }

  const animationName = `anim-${type}`;
  const durationMs = duration * 1000;

  switch (type) {
    case 'fade':
      return `
        @keyframes ${animationName} {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        animation: ${animationName} ${durationMs}ms ease-in-out;
      `;

    case 'slide':
      return `
        @keyframes ${animationName} {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        animation: ${animationName} ${durationMs}ms ease-in-out;
      `;

    case 'scale':
      return `
        @keyframes ${animationName} {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        animation: ${animationName} ${durationMs}ms ease-in-out;
      `;

    default:
      return '';
  }
}

/**
 * Generate Tailwind animation classes
 */
export function animationToTailwind(animation: AnimationProps): string {
  const { type = 'none', duration = 0.3 } = animation;

  if (type === 'none') {
    return '';
  }

  const durationClass = duration <= 0.2 ? 'duration-200' : duration <= 0.5 ? 'duration-500' : 'duration-1000';

  switch (type) {
    case 'fade':
      return `transition-opacity ${durationClass} ease-in-out`;

    case 'slide':
      return `transition-all ${durationClass} ease-in-out`;

    case 'scale':
      return `transition-transform ${durationClass} ease-in-out`;

    default:
      return '';
  }
}

/**
 * Generate scroll trigger script cho animation
 */
export function generateScrollTriggerScript(): string {
  return `
    <script>
      // Intersection Observer for scroll animations
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-in');
            }
          });
        },
        { threshold: 0.1 }
      );

      // Observe all animated elements
      document.querySelectorAll('[data-animate]').forEach((el) => {
        observer.observe(el);
      });
    </script>
  `;
}

/**
 * Generate CSS cho scroll animations
 */
export function generateScrollAnimationCSS(): string {
  return `
    <style>
      [data-animate] {
        opacity: 0;
        transition: all 0.5s ease-in-out;
      }

      [data-animate].animate-in {
        opacity: 1;
      }

      [data-animate="fade"].animate-in {
        opacity: 1;
      }

      [data-animate="slide"] {
        transform: translateY(20px);
      }

      [data-animate="slide"].animate-in {
        transform: translateY(0);
      }

      [data-animate="scale"] {
        transform: scale(0.9);
      }

      [data-animate="scale"].animate-in {
        transform: scale(1);
      }
    </style>
  `;
}
