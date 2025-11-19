/**
 * Frontend Block Renderer - Read-only version for public pages
 */

import type { Block } from '@/lib/blocks/types';
import { cn } from '@/lib/utils';

interface FrontendBlockRendererProps {
  block: Block;
}

export function FrontendBlockRenderer({ block }: FrontendBlockRendererProps) {
  if (block.hidden) {
    return null;
  }

  // Render block content based on type
  const renderContent = () => {
    switch (block.type) {
      case 'text': {
        const content = block.content as any;
        const tag = content.tag || 'p';
        
        if (content.html) {
          return (
            <div
              className={block.styles.element}
              dangerouslySetInnerHTML={{ __html: content.html }}
            />
          );
        }
        
        // Simple text rendering based on tag
        const textContent = content.text || '';
        
        switch (tag) {
          case 'h1':
            return <h1 className={block.styles.element}>{textContent}</h1>;
          case 'h2':
            return <h2 className={block.styles.element}>{textContent}</h2>;
          case 'h3':
            return <h3 className={block.styles.element}>{textContent}</h3>;
          case 'h4':
            return <h4 className={block.styles.element}>{textContent}</h4>;
          case 'h5':
            return <h5 className={block.styles.element}>{textContent}</h5>;
          case 'h6':
            return <h6 className={block.styles.element}>{textContent}</h6>;
          case 'span':
            return <span className={block.styles.element}>{textContent}</span>;
          case 'div':
            return <div className={block.styles.element}>{textContent}</div>;
          default:
            return <p className={block.styles.element}>{textContent}</p>;
        }
      }

      case 'image': {
        const content = block.content as any;
        return (
          <img
            src={content.url || 'https://placehold.co/800x400'}
            alt={content.alt || ''}
            className={block.styles.element}
            width={content.width}
            height={content.height}
          />
        );
      }

      case 'button': {
        const content = block.content as any;
        return (
          <a
            href={content.link || '#'}
            target={content.target || '_self'}
            className={block.styles.element}
          >
            {content.text || 'Button'}
          </a>
        );
      }

      case 'container': {
        const containerContent = block.content as any;
        const background = containerContent?.background;
        
        const getBackgroundStyle = () => {
          if (!background || background.type === 'none') return {};
          
          const opacity = (background.opacity || 100) / 100;
          
          if (background.type === 'color') {
            const hex = background.value || '#f3f4f6';
            // Convert hex to rgba
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return {
              backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})`,
            };
          }
          
          if (background.type === 'image' && background.value) {
            return {
              backgroundImage: `url(${background.value})`,
              backgroundSize: background.size || 'cover',
              backgroundPosition: background.position || 'center',
              backgroundRepeat: background.repeat || 'no-repeat',
              opacity: opacity,
            };
          }
          
          return {};
        };
        
        return (
          <div 
            className={cn(block.styles.container, block.styles.wrapper)}
            style={getBackgroundStyle()}
          >
            {block.children?.map((child) => (
              <FrontendBlockRenderer key={child.id} block={child} />
            ))}
          </div>
        );
      }

      case 'divider': {
        return <hr className={block.styles.element} />;
      }

      case 'spacer': {
        return <div className={block.styles.element} />;
      }

      case 'video': {
        const content = block.content as any;
        
        // YouTube embed
        if (content.provider === 'youtube' && content.url) {
          const videoId = extractYouTubeId(content.url);
          if (videoId) {
            return (
              <div className={block.styles.container}>
                <iframe
                  className={block.styles.element}
                  src={`https://www.youtube.com/embed/${videoId}${
                    content.autoplay ? '?autoplay=1' : ''
                  }`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            );
          }
        }
        
        // Direct video
        if (content.url) {
          return (
            <div className={block.styles.container}>
              <video
                className={block.styles.element}
                src={content.url}
                controls={content.controls !== false}
                autoPlay={content.autoplay}
                loop={content.loop}
              />
            </div>
          );
        }
        
        return null;
      }

      case 'icon': {
        const content = block.content as any;
        // This would need lucide-react icons loaded dynamically
        return (
          <div className={block.styles.element}>
            <span className="text-2xl">{content.name || '⭐'}</span>
          </div>
        );
      }

      case 'html': {
        const content = block.content as any;
        const htmlContainerStyles = block.styles.container || 'w-full';
        
        // Container có Tailwind classes (được compile), content HTML bên trong
        return (
          <div className={htmlContainerStyles}>
            <div dangerouslySetInnerHTML={{ __html: content.html || '' }} />
          </div>
        );
      }

      // Template blocks (Hero, Features, etc.)
      case 'hero-1':
      case 'hero-2':
      case 'features-3col':
      case 'features-grid':
      case 'cta-centered':
      case 'cta-split':
      case 'testimonials':
      case 'pricing':
      case 'team':
      case 'contact-form':
      case 'faq':
      case 'footer': {
        // Template blocks are containers with pre-defined children
        return (
          <div className={cn(block.styles.container, block.styles.wrapper)}>
            {block.children?.map((child) => (
              <FrontendBlockRenderer key={child.id} block={child} />
            ))}
          </div>
        );
      }

      default: {
        console.warn(`Unknown block type: ${block.type}`);
        return null;
      }
    }
  };

  return (
    <div className={block.styles.container}>
      {renderContent()}
    </div>
  );
}

// Helper function to extract YouTube video ID
function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}
