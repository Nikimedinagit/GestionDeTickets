import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";

export function Tooltip({ children, text }) {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    }
    setShow(true);
  };

  return (
    <>
      <div 
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>

      {show && createPortal(
        <div 
          className="fixed z-[9999] pointer-events-none"
          style={{ 
            top: `${coords.top - 8}px`, 
            left: `${coords.left}px`,
            transform: 'translate(-50%, -100%)' 
          }}
        >
          <div className="bg-[#18181b] text-white text-[11px] font-bold px-3 py-1.5 rounded-md shadow-2xl whitespace-nowrap animate-in fade-in zoom-in duration-150 border border-[#1e293b]/50">
            {text}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}