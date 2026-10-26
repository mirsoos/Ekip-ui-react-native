// --- START OF FILE LiquidLens.tsx ---

import React, { useMemo, useState, type ReactNode } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  type StyleProp,
  type ViewStyle,
  type LayoutChangeEvent,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';

export interface LiquidLensProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  marginWidth?: number;
  scale?: number;
  blurDeviation?: number;
  overlayOpacity?: number;
  pointerEvents?: 'none' | 'box-none' | 'box-only' | 'auto';
}

// Global memory cache so SDF Normal Maps are NEVER recalculated for the same dimensions!
// Eliminates CPU lag when switching tabs/screens.
const normalMapCache = new Map<string, string>();

/**
 * Deterministic Signed Distance Field (SDF) Normal Map generator
 * Creates authentic Apple Liquid Glass inward 360-degree refraction
 * with a calm matte center (RGB 128, 128, 128) and silky smooth cos^2 fade.
 */
export function getLiquidLensNormalMap(w: number, h: number, r: number, margin: number): string {
  if (typeof document === 'undefined') return '';
  const key = `${w}x${h}_r${r}_m${margin}`;
  const cached = normalMapCache.get(key);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const imgData = ctx.createImageData(w, h);
  const data = imgData.data;
  const bx = w / 2;
  const by = h / 2;
  const maxR = Math.min(bx, by);
  const effectiveR = Math.max(0, Math.min(r, maxR));

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const px = x - bx + 0.5;
      const py = y - by + 0.5;

      const qx = Math.abs(px) - (bx - effectiveR);
      const qy = Math.abs(py) - (by - effectiveR);
      const d = Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - effectiveR;

      let rVal = 128;
      let gVal = 128;

      if (d > -margin && d <= 0) {
        const t = (-d) / margin;

        // Ultra-soft feather fade into center (smoothstep rise + cos^2 silky fadeout)
        let strength: number;
        if (t < 0.28) {
          const u = t / 0.28;
          strength = u * u * (3 - 2 * u);
        } else {
          const u = (t - 0.28) / 0.72;
          strength = Math.cos(u * Math.PI * 0.5) ** 2;
        }

        const eps = 0.5;
        const qx1 = Math.abs(px + eps) - (bx - effectiveR);
        const qy1 = Math.abs(py) - (by - effectiveR);
        const d1 = Math.min(Math.max(qx1, qy1), 0) + Math.hypot(Math.max(qx1, 0), Math.max(qy1, 0)) - effectiveR;

        const qx2 = Math.abs(px) - (bx - effectiveR);
        const qy2 = Math.abs(py + eps) - (by - effectiveR);
        const d2 = Math.min(Math.max(qx2, qy2), 0) + Math.hypot(Math.max(qx2, 0), Math.max(qy2, 0)) - effectiveR;

        const gx = (d1 - d) / eps;
        const gy = (d2 - d) / eps;
        const len = Math.hypot(gx, gy) || 1;

        const nx = -(gx / len);
        const ny = -(gy / len);

        rVal = Math.round(128 + nx * 120 * strength);
        gVal = Math.round(128 + ny * 120 * strength);
      }

      data[idx] = rVal;
      data[idx + 1] = gVal;
      data[idx + 2] = 128;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const uri = canvas.toDataURL();
  normalMapCache.set(key, uri);
  return uri;
}

let lensIdCounter = 0;

/**
 * Reusable LiquidLens component
 * Can be dropped onto any container, button, floating dock, or card.
 */
export function LiquidLens({
  children,
  style,
  borderRadius = 22,
  marginWidth = 14,
  scale = 36,
  blurDeviation = 1.8,
  overlayOpacity = 0.08,
  pointerEvents = 'none',
}: LiquidLensProps) {
  const [layout, setLayout] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const filterId = useMemo(() => `liquid-lens-${++lensIdCounter}`, []);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    const rw = Math.round(width);
    const rh = Math.round(height);
    if (rw > 0 && rh > 0 && (rw !== layout.width || rh !== layout.height)) {
      setLayout({ width: rw, height: rh });
    }
  };

  const normalMapUri = useMemo(() => {
    if (Platform.OS !== 'web' || layout.width <= 0 || layout.height <= 0) return '';
    return getLiquidLensNormalMap(layout.width, layout.height, borderRadius, marginWidth);
  }, [layout.width, layout.height, borderRadius, marginWidth]);

  return (
    <View
      onLayout={handleLayout}
      pointerEvents={pointerEvents}
      style={[
        styles.container,
        { borderRadius },
        style,
      ]}
    >
      {Platform.OS === 'web' ? (
        <>
          <svg style={{ display: 'none' }} aria-hidden="true">
            <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
              {/* 1. Calm matte frost blur for center */}
              <feGaussianBlur in="SourceGraphic" stdDeviation={blurDeviation} result="matteBackdrop" />

              {/* 2. Deterministic 360-degree rounded capsule lens normal map */}
              {normalMapUri ? (
                <feImage
                  href={normalMapUri}
                  preserveAspectRatio="none"
                  result="refractionMap"
                />
              ) : null}

              {/* 3. Displace matte backdrop smoothly along all inner margins */}
              <feDisplacementMap
                in="matteBackdrop"
                in2="refractionMap"
                scale={scale}
                xChannelSelector="R"
                yChannelSelector="G"
                result="refracted"
              />
            </filter>
          </svg>

          {/* 1. Backdrop displacement filter layer */}
          <View
            style={[
              styles.glassFilter,
              {
                borderRadius,
                filter: `url(#${filterId})`,
              } as any,
            ]}
          />

          {/* Dark tint base layer */}
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                borderRadius,
                backgroundColor: '#0000007d',
                zIndex: 0,
              },
            ]}
            pointerEvents="none"
          />

          {/* 2. Glass tint overlay layer */}
          <View
            style={[
              styles.glassOverlay,
              {
                borderRadius,
                backgroundColor: `rgba(255, 255, 255, ${overlayOpacity})`,
              },
            ]}
          />

          {/* 3. Specular rim highlight layer */}
          <View
            style={[
              styles.glassSpecular,
              { borderRadius },
            ]}
          />
        </>
      ) : (
        /* NATIVE iOS & ANDROID: Real Live BlurView + SVG Inset Specular Rim (Exact match to Web) */
        <>
          <BlurView
            intensity={Math.min(60, Math.round(blurDeviation * 18))}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
            style={[StyleSheet.absoluteFill, { borderRadius }]}
          />

          {/* Same Dark tint base layer as Web (#0000007d) */}
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                borderRadius,
                backgroundColor: '#0000007d',
              },
            ]}
          />

          {/* Same Glass tint overlay layer as Web */}
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                borderRadius,
                backgroundColor: `rgba(255, 255, 255, ${overlayOpacity})`,
              },
            ]}
          />

          {/* Exact SVG equivalent of Web's `inset 0 1px 1px rgba(255,255,255,0.55), inset 0 -1px 1px rgba(255,255,255,0.1)` */}
          {layout.width > 0 && layout.height > 0 && (
            <Svg
              pointerEvents="none"
              width={layout.width}
              height={layout.height}
              style={StyleSheet.absoluteFill}
            >
              <Defs>
                <SvgLinearGradient id="rimGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.58" />
                  <Stop offset="25%" stopColor="#ffffff" stopOpacity="0.12" />
                  <Stop offset="75%" stopColor="#ffffff" stopOpacity="0.05" />
                  <Stop offset="100%" stopColor="#ffffff" stopOpacity="0.18" />
                </SvgLinearGradient>
              </Defs>
              <Rect
                x={0.75}
                y={0.75}
                width={Math.max(0, layout.width - 1.5)}
                height={Math.max(0, layout.height - 1.5)}
                rx={Math.max(0, borderRadius - 0.75)}
                ry={Math.max(0, borderRadius - 0.75)}
                fill="none"
                stroke="url(#rimGrad)"
                strokeWidth={1.5}
              />
            </Svg>
          )}
        </>
      )}

      {/* 4. Child contents (if any) */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)',
        } as any)
      : Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
        }
      : {
          elevation: 0,
        }),
  },
  glassFilter: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.001)',
    pointerEvents: 'none',
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(0px)',
          WebkitBackdropFilter: 'blur(0px)',
          isolation: 'isolate',
        } as any)
      : {}),
  },
  glassOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
    pointerEvents: 'none',
  },
  glassSpecular: {
    ...StyleSheet.absoluteFill,
    zIndex: 2,
    overflow: 'hidden',
    pointerEvents: 'none',
    ...(Platform.OS === 'web'
      ? ({
          boxShadow:
            'inset 0 1px 1px rgba(255, 255, 255, 0.55), inset 0 -1px 1px rgba(255, 255, 255, 0.1)',
        } as any)
      : {}),
  },
});