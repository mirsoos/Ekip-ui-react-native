import React, { type ReactNode, useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getIcon, type IconName } from '../lib/icons';
import { GlassButton, GlassCloseButton } from './Glass';
import { useTheme } from '../lib/theme';
import { useI18n } from '../lib/i18n';

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
  const { isDark } = useTheme();
  const { isRTL } = useI18n();
  const isMounted = useRef(false);
  const [isRendered, setIsRendered] = useState(open);

  useEffect(() => {
    if (open) {
      isMounted.current = true;
      setIsRendered(true);
    } else if (isMounted.current) {
      const closeTimer = window.setTimeout(() => setIsRendered(false), 360);
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
      {/* 1. Backdrop: subtle blur and subtle darkness to prevent content clash */}
      <div
        className={`ekip-sheet-backdrop ${open ? 'animate-fade' : 'animate-fade-out'}`}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.22)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          willChange: 'opacity',
        }}
      />

      {/* 2. Sheet sliding up from bottom with authentic liquid glass container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`ekip-sheet-container ${
          open ? 'animate-sheet-up' : 'animate-sheet-down'
        }`}
        style={{
          position: 'relative',
          width: '100%',
          maxHeight: '92%',
          height: fullHeight ? '92%' : undefined,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: isDark ? 'rgba(14, 20, 34, 0.75)' : 'rgba(255, 255, 255, 0.78)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.22)' : '1px solid rgba(255, 255, 255, 0.85)',
          borderLeft: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(255, 255, 255, 0.60)',
          borderRight: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(255, 255, 255, 0.60)',
          borderBottom: 'none',
          boxShadow: isDark
            ? 'inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.25), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.45), 0 -16px 48px -8px rgba(0, 0, 0, 0.70)'
            : 'inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 1px 0 rgba(255, 255, 255, 0.35), 0 -16px 48px -8px rgba(15, 23, 42, 0.35)',
        }}
      >
        {/* Top drag handle indicator */}
        <div className="ekip-sheet-handle" />

        {/* Sheet header */}
        <div
          className="ekip-sheet-header"
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            gap: 12,
          }}
        >
          {title ? (
            <h2
              className="ekip-sheet-title"
              style={{
                margin: '6px 0 0 0',
                textAlign: isRTL ? 'right' : 'left',
                direction: isRTL ? 'rtl' : 'ltr',
                flex: 1,
              }}
            >
              {title}
            </h2>
          ) : (
            <div style={{ flex: 1, height: 24 }} />
          )}
          <GlassCloseButton onPress={onClose} />
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
