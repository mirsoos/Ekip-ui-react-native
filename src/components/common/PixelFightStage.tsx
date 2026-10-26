// --- START OF FILE PixelFightStage.tsx ---

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';

type FighterPose =
  | 'IDLE'
  | 'WINDUP'
  | 'PUNCH'
  | 'UPPERCUT'
  | 'KICK'
  | 'HIT'
  | 'KNOCKBACK'
  | 'FALL'
  | 'GET_UP'
  | 'LOOK_AT_USER'
  | 'SHOCKED_USER'
  | 'LIFT_UP'
  | 'BEING_LIFTED'
  | 'SIT_PIZZA'
  | 'REACH_PIZZA';

interface PopText {
  x: number;
  y: number;
  text: string;
  color: string;
  vy: number;
  scale: number;
  targetScale: number;
  life: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  type: 'DUST' | 'BLOOD' | 'STEAM' | 'SPARK';
  onFloor?: boolean;
}

interface ImpactFlash {
  x: number;
  y: number;
  radius: number;
  life: number;
  color: string;
}

interface Fighter {
  x: number;
  targetX: number;
  baseX: number;
  y: number;
  vy: number;
  scaleX: number;
  scaleY: number;
  pose: FighterPose;
  facing: 1 | -1;
  flash: number;
}

export function PixelFightStage({ height = 240 }: { height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = window.devicePixelRatio || 1;
    let width = canvas.clientWidth || 380;
    let h = height;

    const setupCanvas = () => {
      width = canvas.clientWidth || 380;
      canvas.width = width * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };
    setupCanvas();

    const groundY = h - 34;
    const P = 3.5; // Base pixel unit

    // Fighters with Physics & Squash/Stretch
    const f1: Fighter = {
      x: width / 2 - 48,
      targetX: width / 2 - 48,
      baseX: width / 2 - 48,
      y: 0,
      vy: 0,
      scaleX: 1,
      scaleY: 1,
      pose: 'IDLE',
      facing: 1,
      flash: 0,
    };

    const f2: Fighter = {
      x: width / 2 + 48,
      targetX: width / 2 + 48,
      baseX: width / 2 + 48,
      y: 0,
      vy: 0,
      scaleX: 1,
      scaleY: 1,
      pose: 'IDLE',
      facing: -1,
      flash: 0,
    };

    // Visual FX Pools
    const popTexts: PopText[] = [];
    const particles: Particle[] = [];
    const impacts: ImpactFlash[] = [];
    let shake = 0;
    let hitStop = 0; // Frame freeze on heavy hits for pro arcade feel
    let starAngle = 0;

    // Special Gag States
    let signScale = 0;
    let pizzaSlicesLeft = 3;
    let ghostOffset = 0;
    let ghostAlpha = 0;
    let armGrabY = 0;

    // Helpers
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const spawnText = (x: number, y: number, text: string, color = '#fbbf24', targetScale = 1.35) => {
      popTexts.push({
        x,
        y,
        text,
        color,
        vy: -1.8,
        scale: 0.2,
        targetScale,
        life: 1,
      });
    };

    const spawnImpact = (x: number, y: number, color = '#ffffff') => {
      impacts.push({ x, y, radius: 22, life: 1, color });
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.4;
        const speed = 2.5 + Math.random() * 3;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 3,
          color: i % 2 === 0 ? '#facc15' : '#ffffff',
          life: 1,
          maxLife: 1,
          type: 'SPARK',
        });
      }
    };

    const spawnDust = (x: number, y: number, count = 6) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 18,
          y: y + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 2.8,
          vy: -Math.random() * 1.8 - 0.4,
          size: Math.random() < 0.5 ? 4 : 6,
          color: '#e2e8f0',
          life: 1,
          maxLife: 1,
          type: 'DUST',
        });
      }
    };

    const spawnBlood = (x: number, y: number, dir: number, count = 16) => {
      const colors = ['#ef4444', '#dc2626', '#b91c1c', '#f87171'];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: dir * (Math.random() * 4 + 1.2) + (Math.random() - 0.5) * 2,
          vy: -Math.random() * 4.2 - 1.2,
          size: Math.random() < 0.4 ? 4 : 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1,
          maxLife: 1,
          type: 'BLOOD',
          onFloor: false,
        });
      }
    };

    // Scenario Management (Smart Shuffle so it doesn't feel robotic)
    type ScenarioType =
      | 'EXCHANGE'
      | 'LOOK_AT_USER'
      | 'PIZZA_BREAK'
      | 'GHOST_REVIVE'
      | 'KNOCKOUT_F2'
      | 'BOTH_FALL'
      | 'YEET';

    const scenarioDeck: ScenarioType[] = [
      'LOOK_AT_USER',
      'PIZZA_BREAK',
      'GHOST_REVIVE',
      'KNOCKOUT_F2',
      'BOTH_FALL',
      'YEET',
    ];
    let deckIndex = 0;
    let currentScenario: ScenarioType = 'EXCHANGE';
    let sceneTick = 0;

    const startNextScenario = (forced?: ScenarioType) => {
      sceneTick = 0;
      ghostOffset = 0;
      ghostAlpha = 0;
      armGrabY = 0;
      signScale = 0;
      pizzaSlicesLeft = 3;

      if (forced) {
        currentScenario = forced;
      } else if (currentScenario !== 'EXCHANGE' && Math.random() < 0.45) {
        // Occasionally weave a quick fight exchange between big gags
        currentScenario = 'EXCHANGE';
      } else {
        currentScenario = scenarioDeck[deckIndex];
        deckIndex = (deckIndex + 1) % scenarioDeck.length;
      }

      f1.targetX = f1.baseX;
      f2.targetX = f2.baseX;
      f1.facing = 1;
      f2.facing = -1;
      f1.pose = 'IDLE';
      f2.pose = 'IDLE';
    };

    // ==========================================
    // PIXEL ART DRAWING HELPERS
    // ==========================================

    const drawPizzaSlice = (x: number, y: number, flip = false) => {
      ctx.save();
      ctx.translate(x, y);
      if (flip) ctx.scale(-1, 1);

      // Crust (Golden brown curved edge)
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-5 * P, -3 * P, 1.5 * P, 4.5 * P);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-5.5 * P, -2.5 * P, 0.8 * P, 3.5 * P);

      // Melted Cheese Triangle ( tapering towards tip )
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-3.5 * P, -2.5 * P, 2.5 * P, 3.8 * P);
      ctx.fillRect(-1 * P, -1.8 * P, 2.5 * P, 2.6 * P);
      ctx.fillRect(1.5 * P, -1 * P, 2 * P, 1.4 * P);

      // Dripping cheese string at the tip!
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(2.5 * P, 0.4 * P, 0.8 * P, 2.2 * P);

      // Tomato sauce peek
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-3.5 * P, -2.8 * P, 2 * P, 0.6 * P);

      // Pepperoni slices
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(-3 * P, -1.2 * P, 1.4 * P, 1.4 * P);
      ctx.fillRect(-0.5 * P, -0.8 * P, 1.3 * P, 1.3 * P);

      ctx.restore();
    };

    const drawPizzaBoxOnGround = (cx: number, gy: number, slices: number, tick: number) => {
      ctx.save();
      ctx.translate(cx, gy);

      // Red & White Checkered Picnic Napkin under the box
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-26, -2, 52, 3);
      ctx.fillStyle = '#ef4444';
      for (let i = -24; i < 24; i += 8) {
        ctx.fillRect(i, -2, 4, 3);
      }

      // Open slanted cardboard lid (behind)
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.moveTo(-18, -3);
      ctx.lineTo(-24, -18);
      ctx.lineTo(14, -18);
      ctx.lineTo(18, -3);
      ctx.closePath();
      ctx.fill();

      // Inner lid grease/white cardboard
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(-19, -15, 31, 10);

      // Little red pizza logo on inside of lid
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-6, -12, 8, 4);

      // Main flat pizza box base
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-20, -5, 40, 4);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-18, -6, 36, 2);

      // Visible Pizza inside box
      if (slices > 0) {
        // Crust ring
        ctx.fillStyle = '#d97706';
        const w = slices === 3 ? 30 : slices === 2 ? 20 : 11;
        ctx.fillRect(-15, -8, w, 3);
        // Melted cheese
        ctx.fillStyle = '#facc15';
        ctx.fillRect(-13, -8, Math.max(4, w - 4), 2.5);
        // Pepperonis
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(-11, -8.5, 3, 2);
        if (slices > 1) ctx.fillRect(-3, -8.5, 3, 2);
        if (slices > 2) ctx.fillRect(5, -8.5, 3, 2);
      }

      // Wavy hot steam lines rising from the pizza
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      for (let i = 0; i < 3; i++) {
        const sy = -14 - ((tick * 0.4 + i * 7) % 18);
        const sx = -10 + i * 10 + Math.sin(tick * 0.12 + i) * 3;
        const alpha = 1 - Math.abs(sy + 14) / 18;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
        ctx.fillRect(sx, sy, 2, 4);
      }

      ctx.restore();
    };

    const drawConfessionSign = (f1X: number, gy: number, scale: number, tick: number) => {
      if (scale <= 0.05) return;
      ctx.save();

      // Anchor at F1's raised hand
      const anchorX = f1X - 8 * P;
      const anchorY = gy - 14 * P;
      ctx.translate(anchorX, anchorY);
      ctx.scale(scale, scale);

      const tilt = Math.sin(tick * 0.08) * 0.05;
      ctx.rotate(tilt);

      // Wooden pole
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-1.5 * P, -18 * P, 3 * P, 22 * P);
      ctx.fillStyle = '#92400e';
      ctx.fillRect(-0.8 * P, -18 * P, 1.2 * P, 22 * P);

      // Large Signboard (ifted high & clear of characters)
      const boardW = 132;
      const boardH = 54;
      const bx = -boardW / 2 + 12;
      const by = -boardH - 22;

      // Drop Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(bx + 4, by + 4, boardW, boardH);

      // Outer Dark Wood Frame
      ctx.fillStyle = '#78350f';
      ctx.fillRect(bx - 3, by - 3, boardW + 6, boardH + 6);

      // Main Bright Parchment / Wood Board
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(bx, by, boardW, boardH);

      // Inner Border Trim
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx + 3, by + 3, boardW - 6, boardH - 6);

      // Corner Nails
      ctx.fillStyle = '#475569';
      ctx.fillRect(bx + 5, by + 5, 3, 3);
      ctx.fillRect(bx + boardW - 8, by + 5, 3, 3);
      ctx.fillRect(bx + 5, by + boardH - 8, 3, 3);
      ctx.fillRect(bx + boardW - 8, by + boardH - 8, 3, 3);

      // Crisp, High-Contrast Text
      ctx.fillStyle = '#dc2626';
      ctx.font = '900 13px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText("IT'S NOT", bx + boardW / 2, by + 17);

      ctx.fillStyle = '#991b1b';
      ctx.font = '900 14px monospace';
      ctx.fillText('MY FAULT!', bx + boardW / 2 - 10, by + 36);

      // Animated Pointing Hand on the Sign pointing right at Fighter 2!
      const bouncePoint = Math.abs(Math.sin(tick * 0.25)) * 6;
      ctx.font = '16px sans-serif';
      ctx.fillText('👉', bx + boardW - 22 + bouncePoint, by + 36);

      ctx.restore();
    };

    const drawPixelFighter = (f: Fighter, isF1: boolean, tick: number) => {
      ctx.save();

      // Shadow on the ground
      const shadowWidth = f.pose === 'FALL' ? 54 : 28 * Math.max(0.5, 1 + f.y / 80);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.fillRect(Math.round(f.x - shadowWidth / 2), groundY - 1, shadowWidth, 4);

      ctx.translate(Math.round(f.x), Math.round(groundY + f.y));
      ctx.scale(f.scaleX, f.scaleY);

      // Palette
      const skinColor = f.flash > 0 ? '#ffffff' : '#fed7aa';
      const shirtColor = f.flash > 0 ? '#ffffff' : isF1 ? '#06b6d4' : '#ec4899';
      const pantsColor = f.flash > 0 ? '#ffffff' : isF1 ? '#1e3a8a' : '#831843';
      const gloveColor = f.flash > 0 ? '#ffffff' : isF1 ? '#ef4444' : '#f59e0b';
      const hairColor = f.flash > 0 ? '#ffffff' : isF1 ? '#facc15' : '#18181b';
      const bandColor = f.flash > 0 ? '#ffffff' : isF1 ? '#2563eb' : '#a855f7';

      // ==========================================
      // POSE 1: 4TH WALL BREAK (LOOK_AT_USER & SHOCKED_USER)
      // ==========================================
      if (f.pose === 'LOOK_AT_USER' || f.pose === 'SHOCKED_USER') {
        const isBlinking = tick % 55 > 48;
        const breathe = Math.sin(tick * 0.12) * 1.2;
        ctx.translate(0, breathe);

        // Hair & Headband
        ctx.fillStyle = hairColor;
        ctx.fillRect(-5 * P, -21 * P, 10 * P, 3 * P);
        ctx.fillStyle = bandColor;
        ctx.fillRect(-5 * P, -18 * P, 10 * P, 2 * P);

        // Head
        ctx.fillStyle = skinColor;
        ctx.fillRect(-4.5 * P, -16 * P, 9 * P, 7 * P);

        // Expressive Eyes
        ctx.fillStyle = '#0f172a';
        if (f.pose === 'SHOCKED_USER') {
          // Wide shocked eyes looking toward the sign
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-3.8 * P, -14.5 * P, 3 * P, 3.2 * P);
          ctx.fillRect(0.8 * P, -14.5 * P, 3 * P, 3.2 * P);
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(-3.2 * P, -13.5 * P, 1.5 * P, 1.5 * P);
          ctx.fillRect(1.2 * P, -13.5 * P, 1.5 * P, 1.5 * P);
          // Shocked open O mouth
          ctx.fillStyle = '#7f1d1d';
          ctx.fillRect(-1.2 * P, -10.8 * P, 2.4 * P, 2.2 * P);
        } else {
          // Innocent whistling / blinking eyes for F1
          if (isBlinking) {
            ctx.fillRect(-3.2 * P, -13 * P, 2.2 * P, 0.8 * P);
            ctx.fillRect(1 * P, -13 * P, 2.2 * P, 0.8 * P);
          } else {
            ctx.fillRect(-3 * P, -14 * P, 2 * P, 2.5 * P);
            ctx.fillRect(1 * P, -14 * P, 2 * P, 2.5 * P);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-3 * P, -14 * P, 0.9 * P, 0.9 * P);
            ctx.fillRect(1 * P, -14 * P, 0.9 * P, 0.9 * P);
          }
          // Rosy innocent cheeks
          ctx.fillStyle = '#fb7185';
          ctx.fillRect(-4 * P, -11.2 * P, 1.4 * P, 1 * P);
          ctx.fillRect(2.6 * P, -11.2 * P, 1.4 * P, 1 * P);
          // Smug innocent smile
          ctx.fillStyle = '#78350f';
          ctx.fillRect(-1 * P, -10.8 * P, 2.2 * P, 0.9 * P);
        }

        // Torso
        ctx.fillStyle = shirtColor;
        ctx.fillRect(-4.5 * P, -9 * P, 9 * P, 5.5 * P);

        // Legs
        ctx.fillStyle = pantsColor;
        ctx.fillRect(-3.5 * P, -3.5 * P, 3 * P, 3.5 * P);
        ctx.fillRect(0.5 * P, -3.5 * P, 3 * P, 3.5 * P);

        if (isF1) {
          // Left hand raised holding the sign pole, right hand pointing at F2!
          ctx.fillStyle = gloveColor;
          ctx.fillRect(-9 * P, -15 * P, 3.2 * P, 3.2 * P); // Raised sign hand
          const pointX = 4.5 * P + Math.sin(tick * 0.25) * 2;
          ctx.fillRect(pointX, -8.5 * P, 3.5 * P, 2.6 * P); // Pointing glove
        } else {
          // F2 frantic hands + sweat drop
          const wave = Math.sin(tick * 0.35) * 3;
          ctx.fillStyle = gloveColor;
          ctx.fillRect(-7 * P, -10 * P + wave, 3 * P, 3 * P);
          ctx.fillRect(4 * P, -10 * P - wave, 3 * P, 3 * P);

          // Animated sweat drop
          const dropY = (tick % 30) * 0.3;
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(5.5 * P, -19 * P + dropY, 2 * P, 3 * P);
        }

        ctx.restore();
        return;
      }

      // ==========================================
      // POSE 2: EATING PIZZA ON THE GROUND
      // ==========================================
      if (f.pose === 'SIT_PIZZA' || f.pose === 'REACH_PIZZA') {
        const chew = Math.sin(tick * 0.45) * 1.2;
        ctx.save();
        if (f.facing === -1) ctx.scale(-1, 1);
        ctx.translate(0, chew);

        // Head
        ctx.fillStyle = hairColor;
        ctx.fillRect(-3.5 * P, -15 * P, 7 * P, 3 * P);
        ctx.fillStyle = bandColor;
        ctx.fillRect(-3.5 * P, -12 * P, 7 * P, 1.8 * P);
        ctx.fillStyle = skinColor;
        ctx.fillRect(-3 * P, -10.2 * P, 6.5 * P, 5.2 * P);

        // Happy eating arc eyes (^ ^)
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0.5 * P, -8.8 * P, 2 * P, 0.9 * P);
        ctx.fillRect(0.2 * P, -8.2 * P, 0.7 * P, 0.7 * P);
        ctx.fillRect(2.1 * P, -8.2 * P, 0.7 * P, 0.7 * P);

        // Chewing mouth + sauce smudge
        ctx.fillStyle = '#b91c1c';
        const mouthOpen = tick % 14 < 7 ? 1.6 * P : 0.7 * P;
        ctx.fillRect(1.2 * P, -6.5 * P, 1.8 * P, mouthOpen);

        // Sitting Torso
        ctx.fillStyle = shirtColor;
        ctx.fillRect(-4 * P, -5 * P, 7.5 * P, 5 * P);

        // Crossed Legs on floor
        ctx.fillStyle = pantsColor;
        ctx.fillRect(-4.5 * P, -0.5 * P, 9 * P, 2.5 * P);
        ctx.fillStyle = '#ffffff'; // Sneaker tip
        ctx.fillRect(4 * P, -0.5 * P, 2 * P, 2.5 * P);

        if (f.pose === 'SIT_PIZZA') {
          // Holding a big clear Pizza Slice right near mouth
          const handBob = Math.sin(tick * 0.45) * 2;
          drawPizzaSlice(7.5 * P, -6.5 * P + handBob, true);
          ctx.fillStyle = gloveColor;
          ctx.fillRect(2.5 * P, -6 * P + handBob, 3 * P, 2.8 * P);
        } else {
          // REACH_PIZZA: Leaning forward grabbing the last slice!
          ctx.fillStyle = gloveColor;
          ctx.fillRect(4 * P, -3 * P, 5.5 * P, 2.8 * P);
        }

        ctx.restore();
        ctx.restore();
        return;
      }

      // Flip horizontally based on facing
      if (f.facing === -1) {
        ctx.scale(-1, 1);
      }

      // ==========================================
      // POSE 3: KNOCKED OUT FLAT ON GROUND
      // ==========================================
      if (f.pose === 'FALL') {
        ctx.fillStyle = skinColor;
        ctx.fillRect(-13 * P, -3.5 * P, 5.5 * P, 4 * P);
        ctx.fillStyle = hairColor;
        ctx.fillRect(-15 * P, -3.5 * P, 2.2 * P, 4 * P);
        ctx.fillStyle = bandColor;
        ctx.fillRect(-13 * P, -4.2 * P, 4.5 * P, 1.2 * P);

        // Knocked out X Eye
        ctx.fillStyle = '#0f172a';
        ctx.font = `bold ${Math.round(6.5 * P)}px monospace`;
        ctx.fillText('×', -11.5 * P, -0.5 * P);

        // Torso & Legs flat
        ctx.fillStyle = shirtColor;
        ctx.fillRect(-7.5 * P, -4 * P, 7.5 * P, 4.5 * P);
        ctx.fillStyle = pantsColor;
        ctx.fillRect(0, -3.5 * P, 7.5 * P, 4 * P);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(7.5 * P, -3.8 * P, 2.5 * P, 4.2 * P);
        ctx.fillStyle = gloveColor;
        ctx.fillRect(-5 * P, -1.5 * P, 3 * P, 2.5 * P);

        // Orbiting Dizzy Stars & Chirping Bird
        if (currentScenario !== 'GHOST_REVIVE') {
          for (let i = 0; i < 3; i++) {
            const a = starAngle + (i * Math.PI * 2) / 3;
            const sx = -10 * P + Math.cos(a) * 18;
            const sy = -13 * P + Math.sin(a) * 5;
            ctx.fillStyle = i === 0 ? '#38bdf8' : '#facc15';
            ctx.fillRect(sx - 2.5, sy - 2.5, 5, 5);
          }
        }

        ctx.restore();
        return;
      }

      // ==========================================
      // POSE 4: GETTING UP DAZED
      // ==========================================
      if (f.pose === 'GET_UP') {
        const wobble = Math.sin(tick * 0.4) * 2.5;
        ctx.translate(wobble, 0);

        ctx.fillStyle = hairColor;
        ctx.fillRect(-3 * P, -13.5 * P, 6 * P, 3 * P);
        ctx.fillStyle = bandColor;
        ctx.fillRect(-3 * P, -11 * P, 6 * P, 1.5 * P);
        ctx.fillStyle = skinColor;
        ctx.fillRect(-2.5 * P, -9.5 * P, 5.5 * P, 4.5 * P);
        ctx.fillStyle = shirtColor;
        ctx.fillRect(-3.5 * P, -5 * P, 6.5 * P, 4.5 * P);
        ctx.fillStyle = pantsColor;
        ctx.fillRect(-4 * P, -1.5 * P, 6.5 * P, 2.5 * P);
        ctx.fillStyle = gloveColor;
        ctx.fillRect(1.5 * P, -2 * P, 3 * P, 2.8 * P);

        ctx.restore();
        return;
      }

      // ==========================================
      // POSE 5: BEING LIFTED OVERHEAD
      // ==========================================
      if (f.pose === 'BEING_LIFTED') {
        const panicShake = Math.sin(tick * 0.8) * 1.5;
        ctx.translate(panicShake, -26 * P);

        ctx.fillStyle = skinColor;
        ctx.fillRect(-8 * P, -3 * P, 5 * P, 5 * P);
        ctx.fillStyle = hairColor;
        ctx.fillRect(-10 * P, -3 * P, 2 * P, 5 * P);
        ctx.fillStyle = shirtColor;
        ctx.fillRect(-3 * P, -3.5 * P, 7 * P, 5 * P);
        ctx.fillStyle = pantsColor;
        ctx.fillRect(4 * P, -3 * P, 6 * P, 4 * P);
        ctx.fillStyle = gloveColor;
        ctx.fillRect(-4 * P, -7 * P, 3 * P, 3 * P);
        ctx.fillRect(-2 * P, 2 * P, 3 * P, 3 * P);

        ctx.restore();
        return;
      }

      // ==========================================
      // STANDARD STANDING & COMBAT POSES
      // ==========================================
      const bob = f.pose === 'IDLE' ? Math.sin(tick * 0.2) * 2 : 0;
      const lean =
        f.pose === 'WINDUP'
          ? -4
          : f.pose === 'PUNCH' || f.pose === 'UPPERCUT'
          ? 5
          : f.pose === 'HIT'
          ? -7
          : f.pose === 'KNOCKBACK'
          ? -11
          : 0;

      ctx.translate(lean, bob);

      // Head & Hair
      ctx.fillStyle = hairColor;
      ctx.fillRect(-2.5 * P, -20 * P, 6.5 * P, 3.5 * P);
      ctx.fillStyle = bandColor;
      ctx.fillRect(-2.5 * P, -16.8 * P, 6.5 * P, 1.8 * P);
      // Flowing headband tail
      const tailWave = Math.sin(tick * 0.25) * 2;
      ctx.fillRect(-4.8 * P, -16.5 * P + tailWave * 0.3, 2.5 * P, 1.5 * P);

      ctx.fillStyle = skinColor;
      ctx.fillRect(-2 * P, -15 * P, 6 * P, 5 * P);

      // Eye
      ctx.fillStyle = '#0f172a';
      if (f.pose === 'HIT' || f.pose === 'KNOCKBACK') {
        // Wincing > eye
        ctx.fillRect(1 * P, -13.5 * P, 2.2 * P, 1 * P);
        ctx.fillRect(1.8 * P, -12.8 * P, 1.2 * P, 1 * P);
      } else {
        // Determined fighter eye
        ctx.fillRect(1.8 * P, -13.5 * P, 1.5 * P, 2 * P);
      }

      // Torso
      ctx.fillStyle = shirtColor;
      ctx.fillRect(-3 * P, -10 * P, 6.5 * P, 6 * P);

      // Legs & Shoes
      ctx.fillStyle = pantsColor;
      if (f.pose === 'KICK') {
        ctx.fillRect(-2.5 * P, -4 * P, 3 * P, 4.5 * P); // Standing leg
        ctx.fillRect(1 * P, -6.5 * P, 9 * P, 3.2 * P); // Extended kicking leg
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(9.5 * P, -7.5 * P, 3 * P, 4.5 * P); // Kick shoe
      } else if (f.pose === 'KNOCKBACK') {
        ctx.fillRect(-4.5 * P, -4.5 * P, 3 * P, 4 * P);
        ctx.fillRect(-0.5 * P, -5.5 * P, 3.5 * P, 3.5 * P);
      } else {
        const step = f.pose === 'IDLE' ? Math.sin(tick * 0.2) * 1.2 : 0;
        ctx.fillRect(-2.8 * P, -4 * P, 2.6 * P, 4.2 * P);
        ctx.fillRect(0.6 * P, -4 * P + step * 0.3, 2.6 * P, 4.2 * P);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-3 * P, -0.5 * P, 3 * P, 1.2 * P);
        ctx.fillRect(0.6 * P, -0.5 * P, 3 * P, 1.2 * P);
      }

      // Arms & Boxing Gloves
      ctx.fillStyle = gloveColor;
      if (f.pose === 'WINDUP') {
        // Pulling fist way back to charge up
        ctx.fillRect(-6.5 * P, -9.5 * P, 4.5 * P, 4.5 * P);
      } else if (f.pose === 'PUNCH') {
        // Smear motion trail + Giant Heavy Boxing Glove!
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fillRect(2 * P, -9.5 * P, 7 * P, 3 * P);
        ctx.fillStyle = gloveColor;
        ctx.fillRect(1.5 * P, -9 * P, 7.5 * P, 2.5 * P);
        ctx.fillRect(8.5 * P, -11.2 * P, 5.5 * P, 6 * P);
        // White glove highlight
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(10 * P, -10.2 * P, 2.5 * P, 1.5 * P);
      } else if (f.pose === 'UPPERCUT') {
        ctx.fillRect(2 * P, -12 * P, 3 * P, 6 * P);
        ctx.fillRect(4 * P, -19 * P, 5.5 * P, 6.5 * P);
      } else if (f.pose === 'LIFT_UP') {
        ctx.fillRect(-3 * P, -18 * P, 3 * P, 8 * P);
        ctx.fillRect(1.5 * P, -18 * P, 3 * P, 8 * P);
      } else if (f.pose === 'HIT' || f.pose === 'KNOCKBACK') {
        ctx.fillRect(-5.5 * P, -10 * P, 3.2 * P, 3.2 * P);
        ctx.fillRect(-3 * P, -12 * P, 3.2 * P, 3.2 * P);
      } else {
        // Idle guard bounce
        const guardBob = Math.cos(tick * 0.2) * 1.5;
        ctx.fillRect(1.8 * P, -8.8 * P + guardBob, 3.4 * P, 3.4 * P);
        ctx.fillRect(-2 * P, -7.8 * P - guardBob, 3 * P, 3 * P);
      }

      ctx.restore();
    };

    // ==========================================
    // MAIN GAME LOOP
    // ==========================================
    const render = () => {
      if (canvas.clientWidth && canvas.clientWidth !== width) {
        setupCanvas();
        f1.baseX = width / 2 - 48;
        f2.baseX = width / 2 + 48;
      }

      // Hit-Stop freeze for crunchy arcade impact
      if (hitStop > 0) {
        hitStop--;
        animId = requestAnimationFrame(render);
        return;
      }

      sceneTick++;
      starAngle += 0.09;

      // Update Fighter Physics (Spring X, Gravity Y, Squash & Stretch recovery)
      [f1, f2].forEach((f) => {
        f.x = lerp(f.x, f.targetX, 0.22);
        f.scaleX = lerp(f.scaleX, 1, 0.25);
        f.scaleY = lerp(f.scaleY, 1, 0.25);
        if (f.flash > 0) f.flash--;

        if (f.y < 0 || f.vy !== 0) {
          f.y += f.vy;
          f.vy += 0.68; // Gravity
          if (f.y >= 0) {
            f.y = 0;
            f.vy = 0;
            // Squash on landing
            f.scaleX = 1.25;
            f.scaleY = 0.78;
            spawnDust(f.x, groundY, 5);
          }
        }
      });

      const centerX = width / 2;

      // ==========================================
      // SCENARIO CHOREOGRAPHY
      // ==========================================
      if (currentScenario === 'EXCHANGE') {
        if (sceneTick === 8) {
          f1.pose = 'WINDUP';
          f1.targetX = f1.baseX - 8;
        } else if (sceneTick === 16) {
          f1.pose = 'PUNCH';
          f1.targetX = centerX - 18;
          f1.scaleX = 1.25;
          f1.scaleY = 0.85;

          f2.pose = 'HIT';
          f2.targetX = f2.baseX + 24;
          f2.flash = 3;
          shake = 6;
          hitStop = 3;
          spawnImpact(centerX + 8, groundY - 34);
          spawnText(f2.x + 10, groundY - 52, 'POW!', '#ef4444');
          spawnBlood(f2.x, groundY - 35, 1, 14);
        } else if (sceneTick === 30) {
          f1.pose = 'IDLE';
          f1.targetX = f1.baseX;
          f2.pose = 'WINDUP';
        } else if (sceneTick === 38) {
          f2.pose = 'KICK';
          f2.targetX = centerX + 18;
          f2.scaleX = 1.25;

          f1.pose = 'HIT';
          f1.targetX = f1.baseX - 26;
          f1.flash = 3;
          shake = 7;
          hitStop = 3;
          spawnImpact(centerX - 8, groundY - 34);
          spawnText(f1.x - 10, groundY - 52, 'SMACK!', '#f59e0b');
          spawnBlood(f1.x, groundY - 35, -1, 14);
        } else if (sceneTick === 54) {
          f1.pose = 'IDLE';
          f2.pose = 'IDLE';
          f1.targetX = f1.baseX;
          f2.targetX = f2.baseX;
        } else if (sceneTick > 72) {
          startNextScenario();
        }
      } else if (currentScenario === 'LOOK_AT_USER') {
        // GAG 1: Super Clear Wooden Confession Sign ("IT'S NOT MY FAULT! 👉")
        if (sceneTick === 1) {
          f1.pose = 'LOOK_AT_USER';
          f2.pose = 'LOOK_AT_USER';
          f1.targetX = centerX - 36;
          f2.targetX = centerX + 46;
        } else if (sceneTick > 10 && sceneTick < 115) {
          signScale = lerp(signScale, 1, 0.22);
          if (sceneTick === 22) {
            f2.pose = 'SHOCKED_USER';
            f2.vy = -5; // Jumps in shock seeing the sign!
            spawnText(f2.x + 12, groundY - 68, 'HEY!! 💢', '#f43f5e', 1.25);
          }
        } else if (sceneTick === 115) {
          // F2 retaliates for being blamed!
          signScale = 0;
          f2.pose = 'PUNCH';
          f2.targetX = centerX - 10;
          f1.pose = 'HIT';
          f1.targetX = f1.baseX - 25;
          f1.flash = 3;
          shake = 7;
          hitStop = 3;
          spawnImpact(f1.x + 10, groundY - 32);
          spawnText(centerX, groundY - 55, 'LIAR! 🥊', '#ec4899');
          spawnBlood(f1.x, groundY - 35, -1, 16);
        } else if (sceneTick > 138) {
          startNextScenario();
        }
      } else if (currentScenario === 'PIZZA_BREAK') {
        // GAG 2: Detailed Pizza Box, Melty Slices & Fight over the Last Slice!
        if (sceneTick === 1) {
          f1.pose = 'SIT_PIZZA';
          f2.pose = 'SIT_PIZZA';
          f1.targetX = centerX - 42;
          f2.targetX = centerX + 42;
          pizzaSlicesLeft = 3;
          spawnText(centerX, groundY - 64, '🍕 PIZZA BREAK!', '#facc15', 1.3);
        } else if (sceneTick === 35) {
          pizzaSlicesLeft = 2;
          spawnText(f1.x - 8, groundY - 45, 'NOM!', '#fbbf24', 1.05);
        } else if (sceneTick === 65) {
          pizzaSlicesLeft = 1; // Down to the last slice!
          spawnText(f2.x + 8, groundY - 45, 'YUM!', '#fbbf24', 1.05);
        } else if (sceneTick === 88) {
          // Both reach for the last slice!
          f1.pose = 'REACH_PIZZA';
          f2.pose = 'REACH_PIZZA';
          f1.targetX = centerX - 25;
          f2.targetX = centerX + 25;
          spawnText(centerX, groundY - 52, 'LAST SLICE! 👀', '#38bdf8', 1.2);
        } else if (sceneTick === 112) {
          // Brawl erupts over the last slice!
          pizzaSlicesLeft = 0;
          f2.pose = 'UPPERCUT';
          f2.targetX = centerX + 6;
          f1.pose = 'KNOCKBACK';
          f1.targetX = f1.baseX - 30;
          f1.vy = -8.5;
          f1.flash = 4;
          shake = 9;
          hitStop = 4;
          spawnImpact(centerX - 6, groundY - 30);
          spawnText(centerX, groundY - 65, 'MINE!! 🍕🥊', '#f43f5e', 1.45);
          spawnBlood(f1.x, groundY - 30, -1, 20);
        } else if (sceneTick === 135) {
          f1.pose = 'FALL';
          f2.pose = 'IDLE';
        } else if (sceneTick === 155) {
          f1.pose = 'GET_UP';
        } else if (sceneTick > 172) {
          startNextScenario();
        }
      } else if (currentScenario === 'GHOST_REVIVE') {
        // GAG 3: Knockout -> Soul floats up -> Body reaches up & yanks soul back!
        if (sceneTick === 8) {
          f1.pose = 'WINDUP';
        } else if (sceneTick === 16) {
          f1.pose = 'UPPERCUT';
          f1.targetX = centerX - 10;
          f2.pose = 'KNOCKBACK';
          f2.targetX = f2.baseX + 25;
          f2.vy = -9;
          f2.flash = 4;
          shake = 9;
          hitStop = 4;
          spawnImpact(centerX + 10, groundY - 38);
          spawnText(f2.x, groundY - 60, 'FATALITY?!', '#ef4444', 1.35);
          spawnBlood(f2.x, groundY - 35, 1, 22);
        } else if (sceneTick === 34) {
          f1.pose = 'IDLE';
          f1.targetX = f1.baseX;
          f2.pose = 'FALL';
        } else if (sceneTick > 40 && sceneTick < 88) {
          ghostOffset = Math.min(68, ghostOffset + 1.3);
          ghostAlpha = Math.min(0.92, ghostAlpha + 0.03);
        } else if (sceneTick >= 88 && sceneTick < 100) {
          armGrabY = Math.min(ghostOffset - 6, armGrabY + 7);
        } else if (sceneTick === 100) {
          shake = 5;
          spawnText(f2.x - 10, groundY - ghostOffset - 18, 'YOINK! ✊', '#facc15', 1.35);
        } else if (sceneTick > 100 && sceneTick < 114) {
          ghostOffset = Math.max(0, ghostOffset - 6.5);
          armGrabY = ghostOffset;
          ghostAlpha = Math.max(0, (ghostOffset / 68) * 0.9);
        } else if (sceneTick === 114) {
          ghostOffset = 0;
          ghostAlpha = 0;
          armGrabY = 0;
          f2.pose = 'IDLE';
          f2.vy = -5.5;
          f2.scaleX = 0.8;
          f2.scaleY = 1.3;
          shake = 5;
          spawnDust(f2.x, groundY, 10);
          spawnText(f2.x, groundY - 55, 'NOT TODAY!', '#38bdf8', 1.3);
        } else if (sceneTick > 138) {
          startNextScenario();
        }
      } else if (currentScenario === 'KNOCKOUT_F2') {
        if (sceneTick === 10) {
          f1.pose = 'WINDUP';
          f1.targetX = f1.baseX - 12;
        } else if (sceneTick === 22) {
          f1.pose = 'UPPERCUT';
          f1.targetX = centerX - 8;
          f2.pose = 'KNOCKBACK';
          f2.targetX = f2.baseX + 34;
          f2.vy = -10;
          f2.flash = 4;
          shake = 10;
          hitStop = 4;
          spawnImpact(centerX + 10, groundY - 40);
          spawnText(f2.x, groundY - 62, 'K.O.!!', '#f43f5e', 1.5);
          spawnBlood(f2.x, groundY - 38, 1, 24);
        } else if (sceneTick === 44) {
          f1.pose = 'IDLE';
          f1.targetX = f1.baseX;
          f2.pose = 'FALL';
          shake = 5;
          spawnText(f2.x, groundY - 28, 'THUD!', '#fbbf24', 1.15);
        } else if (sceneTick === 98) {
          f2.pose = 'GET_UP';
        } else if (sceneTick === 120) {
          f2.pose = 'IDLE';
          f2.targetX = f2.baseX;
          f2.vy = -4;
          spawnText(f2.x, groundY - 50, 'ROUND 2!', '#22c55e', 1.25);
        } else if (sceneTick > 140) {
          startNextScenario();
        }
      } else if (currentScenario === 'BOTH_FALL') {
        if (sceneTick === 1) {
          f1.pose = 'WINDUP';
          f2.pose = 'WINDUP';
        } else if (sceneTick === 14) {
          f1.pose = 'PUNCH';
          f2.pose = 'PUNCH';
          f1.targetX = centerX - 14;
          f2.targetX = centerX + 14;
        } else if (sceneTick === 20) {
          shake = 11;
          hitStop = 4;
          spawnImpact(centerX, groundY - 34);
          spawnText(centerX, groundY - 62, 'DOUBLE BONK!', '#f59e0b', 1.4);
          spawnBlood(centerX - 8, groundY - 35, -1, 14);
          spawnBlood(centerX + 8, groundY - 35, 1, 14);
          f1.pose = 'KNOCKBACK';
          f2.pose = 'KNOCKBACK';
          f1.targetX = f1.baseX - 28;
          f2.targetX = f2.baseX + 28;
          f1.vy = -7.5;
          f2.vy = -7.5;
          f1.flash = 3;
          f2.flash = 3;
        } else if (sceneTick === 38) {
          f1.pose = 'FALL';
          f2.pose = 'FALL';
        } else if (sceneTick === 95) {
          f1.pose = 'GET_UP';
          f2.pose = 'GET_UP';
        } else if (sceneTick === 118) {
          f1.pose = 'IDLE';
          f2.pose = 'IDLE';
          f1.targetX = f1.baseX;
          f2.targetX = f2.baseX;
        } else if (sceneTick > 135) {
          startNextScenario();
        }
      } else if (currentScenario === 'YEET') {
        if (sceneTick === 5) {
          f2.targetX = f1.x + 12;
        } else if (sceneTick === 20) {
          f2.pose = 'LIFT_UP';
          f1.pose = 'BEING_LIFTED';
          f1.targetX = f2.x;
          f1.x = f2.x;
          spawnText(f2.x, groundY - 68, 'HOLD STILL!', '#a855f7', 1.2);
        } else if (sceneTick === 46) {
          f2.pose = 'PUNCH';
          f1.pose = 'KNOCKBACK';
          f1.targetX = f1.baseX - 38;
          f1.vy = -10.5;
          shake = 6;
          spawnText(centerX, groundY - 68, 'YEET!! 🚀', '#facc15', 1.5);
        } else if (sceneTick === 70) {
          f2.pose = 'IDLE';
          f2.targetX = f2.baseX;
          f1.pose = 'FALL';
          shake = 9;
          hitStop = 3;
          spawnImpact(f1.x, groundY - 6);
          spawnBlood(f1.x, groundY - 8, -1, 18);
          spawnText(f1.x, groundY - 32, 'CRASH!', '#ef4444', 1.3);
        } else if (sceneTick === 112) {
          f1.pose = 'GET_UP';
        } else if (sceneTick === 132) {
          f1.pose = 'IDLE';
          f1.targetX = f1.baseX;
        } else if (sceneTick > 146) {
          startNextScenario();
        }
      }

      // ==========================================
      // RENDERING PIPELINE
      // ==========================================
      ctx.clearRect(0, 0, width, h);
      ctx.save();

      // Screen Shake
      if (shake > 0) {
        ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
        shake *= 0.85;
        if (shake < 0.25) shake = 0;
      }

      // Arcade Stage Spotlight Glow
      const grad = ctx.createRadialGradient(
        centerX,
        groundY - 35,
        12,
        centerX,
        groundY - 35,
        175
      );
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.11)');
      grad.addColorStop(0.6, 'rgba(236, 72, 153, 0.04)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, h);

      // Retro 8-Bit Stage Floor
      ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.fillRect(0, groundY, width, 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let gx = 0; gx < width; gx += 20) {
        ctx.fillRect(gx, groundY + 5, 10, 2);
        ctx.fillRect(gx + 10, groundY + 12, 10, 2);
      }

      // Update & Draw Floor Blood & Back Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (p.type === 'BLOOD') {
          if (!p.onFloor) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.32;
            if (p.y >= groundY) {
              p.y = groundY;
              p.vx = 0;
              p.vy = 0;
              p.onFloor = true;
            }
          } else {
            p.life -= 0.007;
          }
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.onFloor ? 2 : p.size);
          ctx.globalAlpha = 1;
          if (p.life <= 0) particles.splice(i, 1);
        }
      }

      // Draw Detailed Pizza Box during PIZZA_BREAK
      if (currentScenario === 'PIZZA_BREAK') {
        drawPizzaBoxOnGround(centerX, groundY, pizzaSlicesLeft, sceneTick);
      }

      // Draw Both Fighters
      drawPixelFighter(f1, true, sceneTick);
      drawPixelFighter(f2, false, sceneTick);

      // Draw Confession Sign Overlay in front of F1
      if (currentScenario === 'LOOK_AT_USER') {
        drawConfessionSign(f1.x, groundY + f1.y, signScale, sceneTick);
      }

      // Draw Ghost & Grabbing Arm during GHOST_REVIVE
      if (currentScenario === 'GHOST_REVIVE' && ghostAlpha > 0.04 && ghostOffset > 2) {
        ctx.save();
        const gx = f2.x - 10;
        const gy = groundY - ghostOffset;

        // Arm reaching up from knocked-out body
        if (armGrabY > 0) {
          ctx.fillStyle = '#ec4899';
          ctx.fillRect(gx - 3, groundY - armGrabY + 10, 8, armGrabY - 10);
          ctx.fillStyle = '#f59e0b'; // Grabbing Boxing Glove
          ctx.fillRect(gx - 6, groundY - armGrabY, 14, 12);
        }

        // Floating Soul / Ghost
        ctx.globalAlpha = ghostAlpha;
        const wave = Math.sin(sceneTick * 0.35) * 2.5;
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(gx - 14, gy - 26, 28, 22);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(gx - 12, gy - 28, 24, 22);

        // Wavy Ghost Tail
        ctx.fillRect(gx - 12 + wave, gy - 4, 7, 7);
        ctx.fillRect(gx - 3, gy - 4, 7, 9);
        ctx.fillRect(gx + 6 - wave, gy - 4, 7, 7);

        // Golden Halo
        ctx.fillStyle = '#facc15';
        ctx.fillRect(gx - 10, gy - 35, 20, 4);

        // Ghost Eyes (Shocked when grabbed!)
        ctx.fillStyle = '#0f172a';
        if (armGrabY > 0) {
          ctx.fillRect(gx - 7, gy - 21, 5, 6);
          ctx.fillRect(gx + 3, gy - 21, 5, 6);
          ctx.fillRect(gx - 2, gy - 12, 5, 5); // Open mouth
        } else {
          ctx.fillRect(gx - 6, gy - 20, 4, 4);
          ctx.fillRect(gx + 3, gy - 20, 4, 4);
        }

        ctx.restore();
      }

      // Draw Impact Starbursts
      for (let i = impacts.length - 1; i >= 0; i--) {
        const imp = impacts[i];
        ctx.save();
        ctx.translate(imp.x, imp.y);
        ctx.rotate(imp.life * 2);
        ctx.fillStyle = imp.life > 0.5 ? '#ffffff' : '#facc15';
        const r = imp.radius * imp.life;
        ctx.fillRect(-r, -3, r * 2, 6);
        ctx.fillRect(-3, -r, 6, r * 2);
        ctx.restore();
        imp.life -= 0.18;
        if (imp.life <= 0) impacts.splice(i, 1);
      }

      // Draw Dust & Sparks
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (p.type === 'BLOOD') continue;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.type === 'SPARK' ? 0.08 : 0.04;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life * 0.7);
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
        ctx.globalAlpha = 1;
        if (p.life <= 0) particles.splice(i, 1);
      }

      // Draw Comic Pop Texts with Elastic Scale & Crisp Outline
      ctx.font = '900 13px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = popTexts.length - 1; i >= 0; i--) {
        const t = popTexts[i];
        t.y += t.vy;
        t.vy *= 0.92;
        t.scale = lerp(t.scale, t.targetScale, 0.3);
        t.life -= 0.022;

        ctx.save();
        ctx.translate(Math.round(t.x), Math.round(t.y));
        ctx.scale(t.scale, t.scale);
        ctx.globalAlpha = Math.max(0, Math.min(1, t.life * 1.5));

        // 8-bit Thick Black Outline
        ctx.fillStyle = '#090d16';
        ctx.fillText(t.text, -1.5, -1.5);
        ctx.fillText(t.text, 1.5, -1.5);
        ctx.fillText(t.text, -1.5, 1.5);
        ctx.fillText(t.text, 1.5, 1.5);
        ctx.fillText(t.text, 0, 2);

        ctx.fillStyle = t.color;
        ctx.fillText(t.text, 0, 0);
        ctx.restore();

        if (t.life <= 0) popTexts.splice(i, 1);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [height]);

  if (Platform.OS !== 'web') {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.nativeText}>👾 8-Bit Retro Brawl</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: 'default',
          userSelect: 'none',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    pointerEvents: 'none',
  },
  nativeText: {
    color: '#f43f5e',
    fontSize: 14,
    fontWeight: '800',
  },
});