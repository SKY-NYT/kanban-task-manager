import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface ModalProps {
  children: React.ReactNode;
  onClose?: () => void;
  overlayClassName?: string;
  panelClassName?: string;
}

export default function Modal({
  children,
  onClose,
  overlayClassName = "",
  panelClassName,
}: ModalProps) {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    if (onClose) onClose();
    else navigate(-1);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);

    const el = panelRef.current;
    if (el) {
      const focusable = el.querySelector<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      );
      focusable?.focus();
    }

    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 ${overlayClassName}`}
      onClick={handleClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className={
          panelClassName ??
          "w-full max-w-85.75 md:max-w-120 bg-background-secondary rounded-[6px] p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar"
        }
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
