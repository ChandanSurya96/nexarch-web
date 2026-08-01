"use client";

import { ReactNode, useEffect } from "react";

import { Button } from "./Button";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  confirmLabel?: string;
  onConfirm?: () => void;
  confirmVariant?: "primary" | "secondary";
  isConfirming?: boolean;
}

/** Confirm dialogs (broker disconnect, make-public) — docs/design-system.md. */
export function Modal({
  open,
  title,
  children,
  onClose,
  confirmLabel,
  onConfirm,
  confirmVariant = "primary",
  isConfirming = false,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-sm rounded-xl border border-border-strong bg-bg-raised p-6"
      >
        <h2
          id="modal-title"
          className="text-title-sm font-semibold tracking-tight text-text-primary"
        >
          {title}
        </h2>
        <div className="mt-3 text-body-sm leading-relaxed text-text-secondary">{children}</div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          {onConfirm && confirmLabel && (
            <Button variant={confirmVariant} onClick={onConfirm} disabled={isConfirming}>
              {isConfirming ? "Please wait…" : confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
