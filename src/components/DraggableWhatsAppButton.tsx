'use client';

import { useCallback, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { useLocale } from 'next-intl';

interface Position {
  x: number;
  y: number;
}

interface DragState {
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  dragging: boolean;
  wasDragging: boolean;
}

const BUTTON_SIZE = 60;
const EDGE_MARGIN = 16;
const BOTTOM_OFFSET = 96;

function clampPosition(position: Position): Position {
  if (typeof window === 'undefined') return position;

  const minX = -(window.innerWidth - BUTTON_SIZE - EDGE_MARGIN * 2);
  const maxX = 12;
  const minY = -(window.innerHeight - BUTTON_SIZE - BOTTOM_OFFSET - EDGE_MARGIN);
  const maxY = BOTTOM_OFFSET - EDGE_MARGIN;

  return {
    x: Math.min(maxX, Math.max(minX, position.x)),
    y: Math.min(maxY, Math.max(minY, position.y)),
  };
}

export default function DraggableWhatsAppButton() {
  const locale = useLocale();
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const dragStateRef = useRef<DragState | null>(null);

  const handlePointerDown = (event: PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
      dragging: false,
      wasDragging: false,
    };
  };

  const handlePointerMove = useCallback((event: PointerEvent<HTMLAnchorElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState) return;

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;
    const isDragging = dragState.dragging || Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4;

    if (!isDragging) return;

    dragState.dragging = true;
    dragState.wasDragging = true;
    setPosition(clampPosition({
      x: dragState.originX + deltaX,
      y: dragState.originY + deltaY,
    }));
  }, []);

  const handlePointerUp = (event: PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <a
      href="https://wa.me/50685850000"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 z-50 grid h-[60px] w-[60px] touch-none place-items-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_-12px_rgba(45,45,45,0.45)] transition-[background-color,opacity,transform] duration-200 hover:bg-[#128C7E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A962] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6EF]"
      style={{
        bottom: BOTTOM_OFFSET,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
      aria-label={locale === 'es' ? 'Contactar por WhatsApp' : 'Contact via WhatsApp'}
      onClick={(event) => {
        if (dragStateRef.current?.wasDragging) {
          event.preventDefault();
          dragStateRef.current = null;
        }
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        dragStateRef.current = null;
      }}
    >
      <svg
        aria-hidden
        className="h-8 w-8"
        viewBox="0 0 32 32"
        fill="currentColor"
      >
        <path d="M16.03 3.2A12.72 12.72 0 0 0 5.2 22.62L3.7 28.8l6.32-1.48A12.71 12.71 0 1 0 16.03 3.2Zm0 2.28a10.43 10.43 0 0 1 8.86 15.94 10.42 10.42 0 0 1-13.95 3.59l-.43-.25-3.77.88.9-3.68-.28-.45A10.43 10.43 0 0 1 16.03 5.48Zm-4.15 5.68c-.23-.52-.48-.53-.7-.54h-.6c-.2 0-.53.08-.8.39-.28.31-1.05 1.03-1.05 2.5 0 1.48 1.08 2.9 1.23 3.1.15.2 2.08 3.34 5.14 4.54 2.54 1 3.06.8 3.61.75.55-.05 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.36-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-.89-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.65-1.63-.92-2.21Z" />
      </svg>
    </a>
  );
}
