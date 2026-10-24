import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';

// Discrete animation poses
type FighterPose =
  | 'IDLE'
  | 'PUNCH'
  | 'KICK'
  | 'HIT'
  | 'KNOCKBACK'
  | 'FALL'
  | 'GET_UP'
  | 'LOOK_AT_USER'
  | 'LIFT_UP'
  | 'BEING_LIFTED'
  | 'SIT_PIZZA';

interface PopText {
  x: number;
  y: number;
  text: string;
  color: string;
  vy: number;
  scale: number;
  life: number;
}

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
}

interface BloodParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  onFloor: boolean;
}

/**
 * Comedic 8-Bit Pixel Brawl Stage
 * Features:
 * 1. Confession sign ("NOT MY FAULT! 👉") during 4th-wall break
 * 2. Ghost floating up from knocked-out body and being yanked back down ("YOINK!")
 * 3. Peaceful pizza break that erupts into a fight over the last slice
 * 4. Blood splatters, random events, knockbacks, and cartoon slapstick
 */
export function PixelFightStage({ height = 230 }: { height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = canvas.clientWidth || 360;
    let h = height;
    canvas.width = width;
    canvas.height = h;

    // Ground line
    const groundY = h - 30;

    // Fighters state
    const f1 = {
      x: width / 2 - 45,
      baseX: width / 2 - 45,
      y: 0,
      pose: 'IDLE' as FighterPose,
      facing: 1 as 1 | -1,
    };

    const f2 = {
      x: width / 2 + 45,
      baseX: width / 2 + 45,
      y: 0,
      pose: 'IDLE' as FighterPose,
      facing: -1 as 1 | -1,
    };

    // Visual FX
    const popTexts: PopText[] = [];
    const dustParticles: DustParticle[] = [];
    const bloodParticles: BloodParticle[] = [];
    let shake = 0;
    let starAngle = 0;

    // Ghost state for the revive gag
    let ghostOffset = 0;
    let ghostAlpha = 0;
    let armGrabY = 0;

    const spawnText = (x: number, y: number, text: string, color = '#fbbf24') => {
      popTexts.push({
        x,
        y,
        text,
        color,
        vy: -1.2,
        scale: 1.4,
        life: 1,
      });
    };

    const spawnDust = (x: number, y: number, count = 6) => {
      for (let i = 0; i < count; i++) {
        dustParticles.push({
          x: x + (Math.random() - 0.5) * 16,
          y: y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 3,
          vy: -Math.random() * 2 - 0.5,
          size: Math.random() < 0.5 ? 4 : 6,
          life: 1,
        });
      }
    };

    const spawnBlood = (x: number, y: number, dir: number, count = 18) => {
      const bloodColors = ['#ef4444', '#dc2626', '#b91c1c', '#f87171', '#991b1b'];
      for (let i = 0; i < count; i++) {
        bloodParticles.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: dir * (Math.random() * 3.5 + 1.2) + (Math.random() - 0.5) * 2.2,
          vy: -Math.random() * 3.8 - 1,
          size: Math.random() < 0.4 ? 4 : Math.random() < 0.7 ? 3 : 2,
          color: bloodColors[Math.floor(Math.random() * bloodColors.length)],
          life: 1,
          onFloor: false,
        });
      }
    };

    // Comedic Scenario Sequencer
    type ScenarioType =
      | 'EXCHANGE'
      | 'LOOK_AT_USER'
      | 'KNOCKOUT_F2'
      | 'PIZZA_BREAK'
      | 'GHOST_REVIVE'
      | 'BOTH_FALL'
      | 'YEET';

    const scenarios: ScenarioType[] = [
      'EXCHANGE',
      'LOOK_AT_USER',
      'KNOCKOUT_F2',
      'PIZZA_BREAK',
      'GHOST_REVIVE',
      'BOTH_FALL',
      'YEET',
    ];
    let scenarioIdx = 0;
    let sceneTick = 0;

    const startNextScenario = (forcedType?: ScenarioType) => {
      sceneTick = 0;
      ghostOffset = 0;
      ghostAlpha = 0;
      armGrabY = 0;
      if (forcedType) {
        currentScenario = forcedType;
      } else {
        scenarioIdx = (scenarioIdx + 1) % scenarios.length;
        currentScenario = scenarios[scenarioIdx];
      }
      f1.x = f1.baseX;
      f2.x = f2.baseX;
      f1.y = 0;
      f2.y = 0;
      f1.facing = 1;
      f2.facing = -1;
      f1.pose = 'IDLE';
      f2.pose = 'IDLE';
    };

    let currentScenario: ScenarioType = 'EXCHANGE';

    // Pixel drawing helper (scale = 3.6 for retro chunky 8-bit vibe)
    const P = 3.6;

    const drawPixelFighter = (
      f: typeof f1,
      isF1: boolean,
      tick: number
    ) => {
      ctx.save();
      ctx.translate(Math.round(f.x), Math.round(groundY + f.y));

      // Colors
      const skinColor = '#fed7aa'; // Peach skin
      const shirtColor = isF1 ? '#06b6d4' : '#ec4899'; // Cyan vs Bright Pink
      const pantsColor = isF1 ? '#1e3a8a' : '#4c0519'; // Indigo vs Crimson
      const gloveColor = isF1 ? '#ef4444' : '#f59e0b'; // Red vs Gold boxing gloves
      const hairColor = isF1 ? '#fbbf24' : '#18181b'; // Blonde cap vs Black headband
      const accessoryColor = isF1 ? '#2563eb' : '#a855f7'; // Blue cap vs Purple headband

      // 1. LOOK_AT_USER: 4th Wall Break with "NOT MY FAULT" Sign
      if (f.pose === 'LOOK_AT_USER') {
        const isBlinking = (tick % 60) > 52;

        // Head
        ctx.fillStyle = hairColor;
        ctx.fillRect(-5 * P, -22 * P, 10 * P, 3 * P);
        ctx.fillStyle = accessoryColor;
        ctx.fillRect(-5 * P, -19 * P, 10 * P, 2 * P);
        ctx.fillStyle = skinColor;
        ctx.fillRect(-4.5 * P, -17 * P, 9 * P, 7 * P);

        // Front-facing eyes
        ctx.fillStyle = '#0f172a';
        if (isBlinking) {
          ctx.fillRect(-3 * P, -13 * P, 2 * P, 0.8 * P);
          ctx.fillRect(1 * P, -13 * P, 2 * P, 0.8 * P);
        } else {
          ctx.fillRect(-3 * P, -14 * P, 2 * P, 2.5 * P);
          ctx.fillRect(1 * P, -14 * P, 2 * P, 2.5 * P);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-3 * P, -14 * P, 1 * P, 1 * P);
          ctx.fillRect(1 * P, -14 * P, 1 * P, 1 * P);
        }

        // Cute blush & mouth
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(-4 * P, -11 * P, 1.2 * P, 1 * P);
        ctx.fillRect(2.8 * P, -11 * P, 1.2 * P, 1 * P);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-1 * P, -11 * P, 2 * P, 1 * P);

        // Torso facing front
        ctx.fillStyle = shirtColor;
        ctx.fillRect(-4.5 * P, -10 * P, 9 * P, 6 * P);

        // Legs
        ctx.fillStyle = pantsColor;
        ctx.fillRect(-3.5 * P, -4 * P, 3 * P, 4 * P);
        ctx.fillRect(0.5 * P, -4 * P, 3 * P, 4 * P);

        if (isF1) {
          // Fighter 1 holds up the wooden confession sign: "NOT MY FAULT! 👉"
          // Wooden stick
          ctx.fillStyle = '#92400e';
          ctx.fillRect(4 * P, -30 * P, 2 * P, 24 * P);

          // Sign board
          ctx.fillStyle = '#fef3c7'; // Wood plank parchment
          ctx.fillRect(-6 * P, -38 * P, 26 * P, 10 * P);
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-6 * P, -38 * P, 26 * P, 10 * P);

          // Sign text: NOT MY FAULT 👉
          ctx.fillStyle = '#dc2626';
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'left';
          ctx.fillText('NOT MY', -4 * P, -32 * P);
          ctx.fillText('FAULT!👉', -4 * P, -24 * P);

          // Hand holding stick
          ctx.fillStyle = gloveColor;
          ctx.fillRect(3 * P, -8 * P, 3 * P, 3 * P);
          ctx.fillRect(-6 * P, -7 * P, 2.5 * P, 3 * P);
        } else {
          // Fighter 2 is shocked with sweat drop!
          ctx.fillStyle = gloveColor;
          ctx.fillRect(-6 * P, -8 * P, 3 * P, 3 * P);
          ctx.fillRect(3 * P, -8 * P, 3 * P, 3 * P);

          // Big sweat drop
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(6 * P, -22 * P, 2.5 * P, 3.5 * P);

          // Question mark overhead
          ctx.fillStyle = '#facc15';
          ctx.font = 'bold 16px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('!?', 0, -25 * P + Math.sin(tick * 0.15) * 2);
        }

        ctx.restore();
        return;
      }

      // 2. SIT_PIZZA: Sitting down eating pizza
      if (f.pose === 'SIT_PIZZA') {
        const chewBob = Math.sin(tick * 0.4) * 1.5;
        ctx.translate(0, chewBob);

        // Head
        ctx.fillStyle = hairColor;
        ctx.fillRect(-3 * P, -14 * P, 6 * P, 3 * P);
        ctx.fillStyle = accessoryColor;
        ctx.fillRect(-3 * P, -11 * P, 6 * P, 2 * P);
        ctx.fillStyle = skinColor;
        ctx.fillRect(-2.5 * P, -9 * P, 5 * P, 5 * P);

        // Happy closed eating eyes: ^ ^
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-1.5 * P, -7 * P, 1.5 * P, 1 * P);
        ctx.fillRect(0.5 * P, -7 * P, 1.5 * P, 1 * P);

        // Chewing mouth
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(-0.5 * P, -5 * P, 1.5 * P, (tick % 10 > 5 ? 1.5 : 0.8) * P);

        // Torso crouched
        ctx.fillStyle = shirtColor;
        ctx.fillRect(-3.5 * P, -4 * P, 7 * P, 5 * P);

        // Crossed sitting legs
        ctx.fillStyle = pantsColor;
        ctx.fillRect(-4 * P, 1 * P, 8 * P, 2.5 * P);

        // Hand holding pizza slice
        ctx.fillStyle = gloveColor;
        ctx.fillRect(isF1 ? 1 * P : -3 * P, -3 * P, 2.5 * P, 2.5 * P);

        // Triangular Pizza Slice in hand
        const px = isF1 ? 3 * P : -5 * P;
        const py = -5 * P;
        ctx.fillStyle = '#f59e0b'; // Cheesy yellow
        ctx.fillRect(px, py, 3 * P, 3 * P);
        ctx.fillStyle = '#b45309'; // Crust
        ctx.fillRect(px - (isF1 ? 0 : 1 * P), py + 2 * P, 3 * P, 1 * P);
        ctx.fillStyle = '#dc2626'; // Pepperoni dot
        ctx.fillRect(px + 1 * P, py + 1 * P, 1 * P, 1 * P);

        ctx.restore();
        return;
      }

      // Horizontal flip according to facing direction
      if (f.facing === -1) {
        ctx.scale(-1, 1);
      }

      // 3. FALL: Character lying flat on the ground
      if (f.pose === 'FALL') {
        ctx.fillStyle = skinColor;
        ctx.fillRect(-14 * P, -3 * P, 6 * P, 4 * P);
        ctx.fillStyle = hairColor;
        ctx.fillRect(-16 * P, -3 * P, 2 * P, 4 * P);
        ctx.fillStyle = accessoryColor;
        ctx.fillRect(-14 * P, -4 * P, 5 * P, 1.5 * P);

        // Knocked out dizzy X eye
        ctx.fillStyle = '#0f172a';
        ctx.font = `bold ${8 * P}px monospace`;
        ctx.fillText('x', -12 * P, -0.5 * P);

        // Torso flat
        ctx.fillStyle = shirtColor;
        ctx.fillRect(-8 * P, -3.5 * P, 8 * P, 4.5 * P);

        // Legs flat
        ctx.fillStyle = pantsColor;
        ctx.fillRect(0, -3 * P, 8 * P, 3.5 * P);

        // Shoes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(8 * P, -3 * P, 2.5 * P, 3.5 * P);

        // Orbiting Dizzy Stars (if not currently in ghost revive sequence)
        if (currentScenario !== 'GHOST_REVIVE') {
          for (let i = 0; i < 3; i++) {
            const a = starAngle + (i * Math.PI * 2) / 3;
            const sx = -11 * P + Math.cos(a) * 16;
            const sy = -14 * P + Math.sin(a) * 5;
            ctx.fillStyle = '#facc15';
            ctx.fillRect(sx - 2, sy - 2, 4, 4);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(sx - 1, sy - 1, 2, 2);
          }
        }

        ctx.restore();
        return;
      }

      // 4. GET_UP: Dazed rising from knees
      if (f.pose === 'GET_UP') {
        const wobble = Math.sin(tick * 0.35) * 2;
        ctx.translate(wobble, 0);

        ctx.fillStyle = hairColor;
        ctx.fillRect(-3 * P, -14 * P, 6 * P, 3 * P);
        ctx.fillStyle = skinColor;
        ctx.fillRect(-2.5 * P, -11 * P, 5 * P, 5 * P);

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-0.5 * P, -9 * P, 2 * P, 1.5 * P);

        ctx.fillStyle = shirtColor;
        ctx.fillRect(-4 * P, -6 * P, 7 * P, 5 * P);

        ctx.fillStyle = gloveColor;
        ctx.fillRect(2 * P, -2 * P, 3 * P, 3 * P);

        ctx.fillStyle = pantsColor;
        ctx.fillRect(-4 * P, -2 * P, 6 * P, 3 * P);

        ctx.restore();
        return;
      }

      // 5. BEING_LIFTED
      if (f.pose === 'BEING_LIFTED') {
        ctx.translate(0, -28 * P);
        ctx.fillStyle = skinColor;
        ctx.fillRect(-8 * P, -3 * P, 5 * P, 5 * P);
        ctx.fillStyle = shirtColor;
        ctx.fillRect(-3 * P, -3 * P, 7 * P, 5 * P);
        ctx.fillStyle = pantsColor;
        ctx.fillRect(4 * P, -3 * P, 6 * P, 4 * P);
        ctx.fillStyle = gloveColor;
        ctx.fillRect(-4 * P, -7 * P, 3 * P, 3 * P);
        ctx.fillRect(2 * P, 3 * P, 3 * P, 3 * P);

        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-10 * P, -7 * P, 2 * P, 3 * P);

        ctx.restore();
        return;
      }

      // Standard Standing & Action Poses (IDLE, PUNCH, KICK, HIT, KNOCKBACK, LIFT_UP)
      const bob = f.pose === 'IDLE' ? Math.sin(tick * 0.18) * 2 : 0;
      const hitLean = f.pose === 'HIT' ? -6 : f.pose === 'KNOCKBACK' ? -12 : 0;
      ctx.translate(hitLean, bob);

      // Head
      ctx.fillStyle = hairColor;
      ctx.fillRect(-2 * P, -20 * P, 6 * P, 4 * P);
      ctx.fillStyle = accessoryColor;
      ctx.fillRect(-2 * P, -17 * P, 6 * P, 2 * P);
      ctx.fillStyle = skinColor;
      ctx.fillRect(-1.5 * P, -15 * P, 5.5 * P, 5 * P);

      // Eye
      ctx.fillStyle = '#0f172a';
      if (f.pose === 'HIT' || f.pose === 'KNOCKBACK') {
        ctx.fillRect(1 * P, -13 * P, 2 * P, 1.2 * P);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-3.5 * P, -17 * P, 2 * P, 2.5 * P);
      } else {
        ctx.fillRect(1.5 * P, -13.5 * P, 1.5 * P, 2 * P);
      }

      // Torso
      ctx.fillStyle = shirtColor;
      ctx.fillRect(-3 * P, -10 * P, 6 * P, 6 * P);

      // Legs
      ctx.fillStyle = pantsColor;
      if (f.pose === 'KICK') {
        ctx.fillRect(-2 * P, -4 * P, 3 * P, 5 * P);
        ctx.fillRect(1 * P, -6 * P, 9 * P, 3.5 * P);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(10 * P, -7 * P, 3 * P, 4.5 * P);
      } else if (f.pose === 'KNOCKBACK') {
        ctx.fillRect(-5 * P, -4 * P, 3 * P, 4 * P);
        ctx.fillRect(-1 * P, -5 * P, 4 * P, 3 * P);
      } else {
        ctx.fillRect(-3 * P, -4 * P, 2.6 * P, 5 * P);
        ctx.fillRect(0.4 * P, -4 * P, 2.6 * P, 5 * P);
      }

      // Arms & Gloves
      if (f.pose === 'PUNCH') {
        ctx.fillStyle = gloveColor;
        ctx.fillRect(1 * P, -9 * P, 8 * P, 2.5 * P);
        ctx.fillRect(8 * P, -11 * P, 5 * P, 6 * P); // GIANT GLOVE!
        ctx.fillRect(-4 * P, -8 * P, 2.5 * P, 3 * P);
      } else if (f.pose === 'LIFT_UP') {
        ctx.fillStyle = gloveColor;
        ctx.fillRect(-3 * P, -18 * P, 3 * P, 8 * P);
        ctx.fillRect(1 * P, -18 * P, 3 * P, 8 * P);
      } else if (f.pose === 'HIT' || f.pose === 'KNOCKBACK') {
        ctx.fillStyle = gloveColor;
        ctx.fillRect(-6 * P, -9 * P, 3 * P, 3 * P);
        ctx.fillRect(-4 * P, -11 * P, 3 * P, 3 * P);
      } else {
        ctx.fillStyle = gloveColor;
        ctx.fillRect(1 * P, -8.5 * P, 3 * P, 3.5 * P);
        ctx.fillRect(-1.5 * P, -7.5 * P, 2.5 * P, 3 * P);
      }

      ctx.restore();
    };

    // Main animation loop
    const render = () => {
      sceneTick++;
      starAngle += 0.08;

      if (canvas.clientWidth && canvas.clientWidth !== width) {
        width = canvas.clientWidth;
        canvas.width = width;
        f1.baseX = width / 2 - 45;
        f2.baseX = width / 2 + 45;
      }

      ctx.clearRect(0, 0, width, h);

      ctx.save();

      // Screen Shake
      if (shake > 0) {
        const sx = (Math.random() - 0.5) * shake;
        const sy = (Math.random() - 0.5) * shake;
        ctx.translate(sx, sy);
        shake *= 0.88;
        if (shake < 0.2) shake = 0;
      }

      // Retro Background Glow
      const centerX = width / 2;
      const grad = ctx.createRadialGradient(
        centerX,
        groundY - 40,
        10,
        centerX,
        groundY - 40,
        160
      );
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, h);

      // Retro Ground Line
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.fillRect(0, groundY + 1, width, 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      for (let gx = 0; gx < width; gx += 16) {
        ctx.fillRect(gx, groundY + 4, 8, 1);
        ctx.fillRect(gx + 8, groundY + 12, 8, 1);
      }

      // ==========================================
      // SCENARIO STATE MACHINE (Comedy & Action)
      // ==========================================
      if (currentScenario === 'EXCHANGE') {
        if (sceneTick === 15) {
          f1.pose = 'PUNCH';
          f2.pose = 'HIT';
          f2.x += 18;
          shake = 4;
          spawnText(f2.x, groundY - 45, 'POW!', '#ef4444');
          spawnDust(f2.x, groundY);
          spawnBlood(f2.x, groundY - 35, 1, 16);
        } else if (sceneTick === 28) {
          f1.pose = 'IDLE';
          f2.pose = 'IDLE';
          f2.x = f2.baseX;
        } else if (sceneTick === 42) {
          f2.pose = 'KICK';
          f1.pose = 'HIT';
          f1.x -= 20;
          shake = 5;
          spawnText(f1.x, groundY - 45, 'WHACK!', '#f59e0b');
          spawnDust(f1.x, groundY);
          spawnBlood(f1.x, groundY - 35, -1, 16);
        } else if (sceneTick === 58) {
          f1.pose = 'IDLE';
          f2.pose = 'IDLE';
          f1.x = f1.baseX;
        } else if (sceneTick > 75) {
          startNextScenario();
        }
      } else if (currentScenario === 'LOOK_AT_USER') {
        // GAG 1: 4th wall break + Confession Sign ("NOT MY FAULT! 👉")
        if (sceneTick === 1) {
          f1.pose = 'LOOK_AT_USER';
          f2.pose = 'LOOK_AT_USER';
          spawnText(centerX, groundY - 60, '...👀...', '#38bdf8');
        } else if (sceneTick > 105) {
          // Snap back to brawl!
          f1.pose = 'PUNCH';
          f2.pose = 'HIT';
          shake = 5;
          spawnText(f2.x, groundY - 45, 'OOPS!', '#ec4899');
          spawnBlood(f2.x, groundY - 35, 1, 16);
          startNextScenario('EXCHANGE');
        }
      } else if (currentScenario === 'KNOCKOUT_F2') {
        if (sceneTick < 25) {
          f1.pose = 'IDLE';
          f1.x = f1.baseX - Math.sin(sceneTick * 0.4) * 3;
        } else if (sceneTick === 25) {
          f1.pose = 'PUNCH';
          f2.pose = 'KNOCKBACK';
          f2.y = -15;
          shake = 8;
          spawnText(f2.x, groundY - 50, 'K.O.!', '#f43f5e');
          spawnDust(f2.x, groundY, 8);
          spawnBlood(f2.x, groundY - 35, 1, 28);
        } else if (sceneTick > 25 && sceneTick < 40) {
          f2.x += 4;
          f2.y += 1;
        } else if (sceneTick === 40) {
          f1.pose = 'IDLE';
          f2.pose = 'FALL';
          f2.y = 0;
          shake = 5;
          spawnDust(f2.x, groundY, 10);
          spawnBlood(f2.x, groundY - 4, 1, 12);
          spawnText(f2.x, groundY - 30, 'THUD!', '#fbbf24');
        } else if (sceneTick === 105) {
          f2.pose = 'GET_UP';
          spawnDust(f2.x, groundY, 4);
        } else if (sceneTick === 130) {
          f2.pose = 'IDLE';
          f2.x = f2.baseX;
          spawnText(f2.x, groundY - 45, 'READY!', '#22c55e');
        } else if (sceneTick > 145) {
          startNextScenario();
        }
      } else if (currentScenario === 'PIZZA_BREAK') {
        // GAG 2: Pizza break then brawl over last slice!
        if (sceneTick === 1) {
          f1.pose = 'SIT_PIZZA';
          f2.pose = 'SIT_PIZZA';
          f1.x = centerX - 26;
          f2.x = centerX + 26;
          spawnText(centerX, groundY - 55, '🍕 PIZZA TIME!', '#f59e0b');
        } else if (sceneTick === 30 || sceneTick === 50) {
          spawnText(centerX, groundY - 38, 'NOM!', '#fbbf24');
        } else if (sceneTick === 72) {
          // Fight over last slice! F2 slaps F1!
          f2.pose = 'PUNCH';
          f1.pose = 'HIT';
          f1.y = -8;
          shake = 6;
          spawnText(centerX, groundY - 50, 'MINE! 🥊', '#f43f5e');
          spawnBlood(f1.x, groundY - 30, -1, 18);
        } else if (sceneTick === 90) {
          f1.pose = 'KICK';
          f2.pose = 'HIT';
          shake = 6;
          spawnText(f2.x, groundY - 45, 'NO MINE!', '#06b6d4');
          spawnBlood(f2.x, groundY - 30, 1, 18);
        } else if (sceneTick > 115) {
          startNextScenario('EXCHANGE');
        }
      } else if (currentScenario === 'GHOST_REVIVE') {
        // GAG 3: Knockout -> Ghost flies up -> Arm grabs ghost & yanks down!
        if (sceneTick === 1) {
          f1.pose = 'PUNCH';
          f2.pose = 'KNOCKBACK';
          f2.y = -14;
          shake = 7;
          spawnText(f2.x, groundY - 45, 'FATAL!', '#ef4444');
          spawnBlood(f2.x, groundY - 30, 1, 24);
        } else if (sceneTick === 15) {
          f1.pose = 'IDLE';
          f2.pose = 'FALL';
          f2.y = 0;
          spawnDust(f2.x, groundY, 8);
        } else if (sceneTick > 25 && sceneTick < 70) {
          // Ghost floats up!
          ghostOffset = Math.min(65, ghostOffset + 1.2);
          ghostAlpha = Math.min(0.9, ghostAlpha + 0.03);
        } else if (sceneTick >= 70 && sceneTick < 82) {
          // Arm shoots up from the ground to grab the ghost's ankle!
          armGrabY = Math.min(ghostOffset, armGrabY + 6);
        } else if (sceneTick === 82) {
          shake = 4;
          spawnText(f2.x - 10, groundY - ghostOffset - 15, 'YOINK!', '#facc15');
        } else if (sceneTick > 82 && sceneTick < 96) {
          // Yanked back down!
          ghostOffset = Math.max(0, ghostOffset - 5);
          armGrabY = ghostOffset;
          ghostAlpha = Math.max(0, ghostAlpha - 0.08);
        } else if (sceneTick === 96) {
          // Springs back up!
          f2.pose = 'IDLE';
          f2.x = f2.baseX;
          shake = 4;
          spawnDust(f2.x, groundY, 10);
          spawnText(f2.x, groundY - 45, 'BACK! 👻', '#38bdf8');
        } else if (sceneTick > 115) {
          startNextScenario();
        }
      } else if (currentScenario === 'BOTH_FALL') {
        if (sceneTick < 22) {
          f1.x += 1.8;
          f2.x -= 1.8;
          if (sceneTick % 4 === 0) spawnDust((f1.x + f2.x) / 2, groundY, 2);
        } else if (sceneTick === 22) {
          shake = 10;
          spawnText(centerX, groundY - 50, 'HEAD BONK!', '#f59e0b');
          spawnBlood(centerX - 8, groundY - 35, -1, 14);
          spawnBlood(centerX + 8, groundY - 35, 1, 14);
          f1.pose = 'KNOCKBACK';
          f2.pose = 'KNOCKBACK';
          f1.y = -10;
          f2.y = -10;
        } else if (sceneTick > 22 && sceneTick < 34) {
          f1.x -= 3;
          f2.x += 3;
          f1.y += 1;
          f2.y += 1;
        } else if (sceneTick === 34) {
          f1.pose = 'FALL';
          f2.pose = 'FALL';
          f1.y = 0;
          f2.y = 0;
          shake = 6;
          spawnDust(f1.x, groundY, 8);
          spawnDust(f2.x, groundY, 8);
          spawnBlood(f1.x, groundY - 4, -1, 8);
          spawnBlood(f2.x, groundY - 4, 1, 8);
        } else if (sceneTick === 105) {
          f1.pose = 'GET_UP';
          f2.pose = 'GET_UP';
        } else if (sceneTick === 130) {
          f1.pose = 'IDLE';
          f2.pose = 'IDLE';
          f1.x = f1.baseX;
          f2.x = f2.baseX;
        } else if (sceneTick > 145) {
          startNextScenario();
        }
      } else if (currentScenario === 'YEET') {
        if (sceneTick < 20) {
          f2.x -= 1.5;
        } else if (sceneTick === 20) {
          f2.pose = 'LIFT_UP';
          f1.pose = 'BEING_LIFTED';
          f1.x = f2.x;
          spawnText(centerX, groundY - 55, 'YEET!', '#facc15');
        } else if (sceneTick === 42) {
          f2.pose = 'IDLE';
          f1.pose = 'KNOCKBACK';
          f1.y = -22;
        } else if (sceneTick > 42 && sceneTick < 58) {
          f1.x -= 4.5;
          f1.y += 1.4;
        } else if (sceneTick === 58) {
          f1.pose = 'FALL';
          f1.y = 0;
          shake = 7;
          spawnDust(f1.x, groundY, 10);
          spawnBlood(f1.x, groundY - 4, -1, 24);
          spawnText(f1.x, groundY - 30, 'SLAM!', '#ef4444');
        } else if (sceneTick === 115) {
          f1.pose = 'GET_UP';
        } else if (sceneTick === 138) {
          f1.pose = 'IDLE';
          f1.x = f1.baseX;
          f2.x = f2.baseX;
        } else if (sceneTick > 150) {
          startNextScenario();
        }
      }

      // Render Blood Particles
      for (let i = bloodParticles.length - 1; i >= 0; i--) {
        const b = bloodParticles[i];
        if (!b.onFloor) {
          b.x += b.vx;
          b.y += b.vy;
          b.vy += 0.28;
          if (b.y >= groundY + 1) {
            b.y = groundY + 1;
            b.vx = 0;
            b.vy = 0;
            b.onFloor = true;
          }
        } else {
          b.life -= 0.008;
        }
        ctx.fillStyle = b.color;
        ctx.globalAlpha = Math.max(0, b.life);
        ctx.fillRect(Math.round(b.x), Math.round(b.y), b.size, b.size);
        ctx.globalAlpha = 1.0;
        if (b.life <= 0) bloodParticles.splice(i, 1);
      }

      // Render Pizza Box / Slice on ground during PIZZA_BREAK
      if (currentScenario === 'PIZZA_BREAK') {
        const pBoxW = 24;
        const pBoxH = 6;
        ctx.fillStyle = '#b45309'; // Pizza box bottom
        ctx.fillRect(centerX - pBoxW / 2, groundY - pBoxH, pBoxW, pBoxH);
        ctx.fillStyle = '#f59e0b'; // Whole pizza surface
        ctx.fillRect(centerX - pBoxW / 2 + 2, groundY - pBoxH - 2, pBoxW - 4, 2);
        // Pepperoni dots
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(centerX - 4, groundY - pBoxH - 2, 2, 2);
        ctx.fillRect(centerX + 3, groundY - pBoxH - 2, 2, 2);
      }

      // Render Fighters
      drawPixelFighter(f1, true, sceneTick);
      drawPixelFighter(f2, false, sceneTick);

      // Render Ghost & Grab Arm during GHOST_REVIVE
      if (currentScenario === 'GHOST_REVIVE' && ghostAlpha > 0) {
        ctx.save();
        const gx = f2.x - 12;
        const gy = groundY - ghostOffset;

        // Reaching Arm from ground
        if (armGrabY > 0) {
          ctx.fillStyle = '#f59e0b'; // Gold boxing glove
          ctx.fillRect(gx + 2, groundY - armGrabY, 4 * P, 4 * P);
          ctx.fillStyle = '#ec4899'; // Arm sleeve
          ctx.fillRect(gx + 4, groundY - armGrabY + 4 * P, 2.5 * P, armGrabY - 4 * P);
        }

        // Ghost body
        ctx.globalAlpha = ghostAlpha;
        ctx.fillStyle = '#f8fafc'; // Translucent white ghost
        ctx.fillRect(gx - 4 * P, gy - 8 * P, 8 * P, 7 * P); // Ghost head
        ctx.fillRect(gx - 5 * P, gy - 5 * P, 10 * P, 5 * P); // Ghost body
        // Ghost wavy tail
        const tailWave = Math.sin(sceneTick * 0.4) * 2;
        ctx.fillRect(gx - 3 * P + tailWave, gy, 3 * P, 3 * P);
        ctx.fillRect(gx + 1 * P - tailWave, gy, 3 * P, 3 * P);

        // Angel Halo
        ctx.fillStyle = '#facc15';
        ctx.fillRect(gx - 3 * P, gy - 11 * P, 6 * P, 1.5 * P);

        // Cute Ghost Eyes: o o
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(gx - 2.5 * P, gy - 6 * P, 1.5 * P, 1.5 * P);
        ctx.fillRect(gx + 1 * P, gy - 6 * P, 1.5 * P, 1.5 * P);

        ctx.restore();
      }

      // Render Dust Particles
      for (let i = dustParticles.length - 1; i >= 0; i--) {
        const d = dustParticles[i];
        d.x += d.vx;
        d.y += d.vy;
        d.life -= 0.04;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, d.life * 0.45)})`;
        ctx.fillRect(d.x, d.y, d.size, d.size);
        if (d.life <= 0) dustParticles.splice(i, 1);
      }

      // Render Pop Texts ("POW!", "YOINK!", "MINE!", etc.)
      ctx.font = '900 13px monospace';
      ctx.textAlign = 'center';
      for (let i = popTexts.length - 1; i >= 0; i--) {
        const t = popTexts[i];
        t.y += t.vy;
        t.life -= 0.025;
        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.scale(t.scale, t.scale);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillText(t.text, 1, 1);
        ctx.fillStyle = t.color;
        ctx.globalAlpha = Math.max(0, t.life);
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
