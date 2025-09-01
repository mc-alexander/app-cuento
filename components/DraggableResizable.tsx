import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StoryElement } from '../types';

interface DraggableResizableProps {
  children: React.ReactNode;
  element: StoryElement;
  onUpdate: (id: string, updates: Partial<StoryElement>) => void;
  isSelected: boolean;
  onSelect: () => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}

const DraggableResizable: React.FC<DraggableResizableProps> = ({
  children, element, onUpdate, isSelected, onSelect, canvasRef
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
  }, [onSelect]);

  const handleResizeStart = useCallback((e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();
    setIsResizing(direction);
  }, [onSelect]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging && !isResizing) return;
      e.preventDefault();
      e.stopPropagation();

      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      if (isDragging) {
        onUpdate(element.id, {
          x: element.x + e.movementX,
          y: element.y + e.movementY
        });
      }

      if (isResizing) {
        let { x, y, width, height } = element;
        if (isResizing.includes('right')) width += e.movementX;
        if (isResizing.includes('left')) {
          width -= e.movementX;
          x += e.movementX;
        }
        if (isResizing.includes('bottom')) height += e.movementY;
        if (isResizing.includes('top')) {
          height -= e.movementY;
          y += e.movementY;
        }
        onUpdate(element.id, { x, y, width, height });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsDragging(false);
      setIsResizing(null);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, element, onUpdate, canvasRef]);
  
  const resizeHandles = [
    { direction: 'top-left', cursor: 'nwse-resize' },
    { direction: 'top-right', cursor: 'nesw-resize' },
    { direction: 'bottom-left', cursor: 'nesw-resize' },
    { direction: 'bottom-right', cursor: 'nwse-resize' },
  ];
  
  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        backgroundColor: element.backgroundColor,
        opacity: element.opacity,
      }}
      className={`select-none ${isSelected ? 'border-2 border-dashed border-sky-500' : 'border border-transparent hover:border-dashed hover:border-slate-400'}`}
      onMouseDown={handleDragStart}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-full h-full relative">
        {children}
        {isSelected && (
          <>
            {resizeHandles.map(handle => (
              <div
                key={handle.direction}
                onMouseDown={(e) => handleResizeStart(e, handle.direction)}
                className="absolute w-3 h-3 bg-white border border-sky-500 rounded-full"
                style={{
                  cursor: handle.cursor,
                  top: handle.direction.includes('top') ? '-6px' : undefined,
                  bottom: handle.direction.includes('bottom') ? '-6px' : undefined,
                  left: handle.direction.includes('left') ? '-6px' : undefined,
                  right: handle.direction.includes('right') ? '-6px' : undefined,
                }}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default DraggableResizable;