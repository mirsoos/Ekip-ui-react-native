import React, { type ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getIcon, type IconName } from '../lib/icons';
import { GlassButton } from './Glass';

function getPortalTarget(): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  return document.getElementById('phone-container') || document.body;
}

// ============================================
// GLASS SHEET (Bottom Sheet Modal) — Web Platform
// ============================================
export interface GlassSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  fullHeight?: boolean;
  contentClassName?: string;
}

export function GlassSheet({
  open,
  onClose,
  children,
  title,
  fullHeight,
  contentClassName = '',
}: GlassSheetProps) {
  const [isRendered, setIsRendered] = useState(open);

  useEffect(() => {
    if (open) {
      setIsRendered(true);
    } else {
      const closeTimer = window.setTimeout(() => setIsRendered(false), 550);
      return () => window.clearTimeout(closeTimer);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!isRendered) return null;

  const content = (
    <div
      className="screen-overlay screen-overlay-sheet"
      onClick={onClose}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
      }}
    >
      {/* Dynamic blurred/tinted backdrop that stays in place while sheet slides up */}
      <div
        key={`backdrop-${open}`}
        className={`ekip-sheet-backdrop ${open ? 'animate-fade' : 'animate-fade-out'}`}
      />

      {/* Sheet sliding up from bottom with authentic iOS 26 liquid glass & sheen */}
      <div
        key={`sheet-${open}`}
        onClick={(e) => e.stopPropagation()}
        className={`ekip-sheet-container glass-thick glass-specular glass-edge ${
          open ? 'animate-sheet-up' : 'animate-sheet-down'
        }`}
        style={{
          height: fullHeight ? '92%' : undefined,
        }}
      >
        {/* Top drag handle indicator */}
        <div className="ekip-sheet-handle" />

        {/* Sheet header */}
        <div className="ekip-sheet-header">
          {title ? (
            <h2 className="ekip-sheet-title">{title}</h2>
          ) : (
            <div style={{ height: 24 }} />
          )}
          <button
            type="button"
            onClick={onClose}
            className="ekip-sheet-close glass-thin glass-specular"
            aria-label="Close"
          >
            {(() => {
              const CloseIcon = getIcon('X');
              return <CloseIcon size={16} color="#a0aec0" strokeWidth={2.4} />;
            })()}
          </button>
        </div>

        {/* Scrollable content */}
        <div className={`ekip-sheet-content ${contentClassName}`}>{children}</div>
      </div>
    </div>
  );

  const target = getPortalTarget();
  return target ? createPortal(content, target) : content;
}

// ============================================
// GLASS DIALOG (Centered Alert Modal) — Web Platform
// ============================================
export interface GlassDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  body?: string;
  children?: ReactNode;
  actions?: {
    label: string;
    variant?: 'primary' | 'secondary' | 'danger';
    onPress?: () => void;
    onClick?: () => void;
  }[];
}

export function GlassDialog({
  open,
  onClose,
  title,
  body,
  children,
  actions,
}: GlassDialogProps) {
  const [isRendered, setIsRendered] = useState(open);

  useEffect(() => {
    if (open) {
      setIsRendered(true);
    } else {
      const closeTimer = window.setTimeout(() => setIsRendered(false), 500);
      return () => window.clearTimeout(closeTimer);
    }
  }, [open]);

  if (!isRendered) return null;

  const content = (
    <div
      className="screen-overlay screen-overlay-dialog"
      onClick={onClose}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        overflow: 'hidden',
      }}
    >
      <div
        key={`dialog-backdrop-${open}`}
        className={`ekip-dialog-backdrop ${open ? 'animate-fade' : 'animate-fade-out'}`}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className={`glass-thick glass-specular glass-edge ${
          open ? 'animate-scale-in' : 'animate-scale-out'
        }`}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 340,
          borderRadius: 28,
          padding: 24,
          zIndex: 1,
        }}
      >
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#ffffff',
            textAlign: 'center',
            letterSpacing: -0.01,
            margin: 0,
          }}
        >
          {title}
        </h2>
        {body && (
          <p
            style={{
              fontSize: 14,
              color: '#a0aec0',
              textAlign: 'center',
              marginTop: 8,
              marginBottom: 0,
            }}
          >
            {body}
          </p>
        )}
        {children}
        {actions && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
            {actions.map((act, i) => (
              <GlassButton
                key={i}
                variant={act.variant ?? 'secondary'}
                fullWidth
                onPress={act.onPress ?? act.onClick}
              >
                {act.label}
              </GlassButton>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const target = getPortalTarget();
  return target ? createPortal(content, target) : content;
}

// ============================================
// TOAST (Transient Toast Message) — Web Platform
// ============================================
export function Toast({
  message,
  icon = 'CheckCircle2',
  visible,
}: {
  message: string;
  icon?: IconName;
  visible?: boolean;
}) {
  const isVisible = visible !== undefined ? visible : Boolean(message);
  if (!isVisible || !message) return null;

  const IconComp = getIcon(icon);
  const content = (
    <div
      className="animate-pop"
      style={{
        position: 'absolute',
        top: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100000,
        pointerEvents: 'none',
      }}
    >
      <div
        className="glass-thick glass-specular glass-edge"
        style={{
          borderRadius: 16,
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          maxWidth: 320,
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
        }}
      >
        <IconComp size={20} color="#22c55e" strokeWidth={2.4} style={{ flexShrink: 0 }} />
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#ffffff',
          }}
        >
          {message}
        </span>
      </div>
    </div>
  );

  const target = getPortalTarget();
  return target ? createPortal(content, target) : content;
}
