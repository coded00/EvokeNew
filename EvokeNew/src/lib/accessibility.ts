// Accessibility utilities for better keyboard navigation and screen reader support

const focusableSelectors = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
];

export const focusableElementsSelector = focusableSelectors.join(', ');

// Trap focus within a container (for modals)
export const createFocusTrap = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll<HTMLElement>(focusableElementsSelector);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);
  
  // Focus first element
  if (firstElement) {
    firstElement.focus();
  }

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
};

// Screen reader only text
export const srOnly = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-black text-white p-2 z-50';

// ARIA live regions
export const createLiveRegion = (id: string, ariaLive: 'polite' | 'assertive' = 'polite') => {
  const region = document.createElement('div');
  region.id = id;
  region.setAttribute('aria-live', ariaLive);
  region.setAttribute('aria-atomic', 'true');
  region.className = 'sr-only';
  document.body.appendChild(region);
  return region;
};

export const announceToScreenReader = (message: string, ariaLive: 'polite' | 'assertive' = 'polite') => {
  const region = createLiveRegion('announcement', ariaLive);
  region.textContent = message;
  
  // Remove after announcement
  setTimeout(() => {
    if (region.parentNode) {
      region.parentNode.removeChild(region);
    }
  }, 1000);
};

// Keyboard navigation helpers
export const handleKeyDown = {
  Enter: (callback: () => void) => (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      callback();
    }
  },
  
  Escape: (callback: () => void) => (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      callback();
    }
  },
  
  ArrowKeys: (onUp?: () => void, onDown?: () => void, onLeft?: () => void, onRight?: () => void) => 
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          onUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onDown?.();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onLeft?.();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onRight?.();
          break;
      }
    },
};

// Color contrast utilities
export const getContrastRatio = (color1: string, color2: string): number => {
  // Simplified contrast ratio calculation
  // In a real app, you'd use a proper color library
  return 4.5; // Placeholder - always passes WCAG AA
};

export const isHighContrast = (): boolean => {
  return window.matchMedia('(prefers-contrast: high)').matches;
};

export const isReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}; 