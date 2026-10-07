import { useMemo } from "react";
import {
  BlurMask,
  Canvas,
  Circle,
  Fill,
  Group,
  LinearGradient,
  Oval,
  Path,
  RadialGradient,
  Rect,
  RoundedRect,
  Shader,
  Skia,
  useClock,
  vec,
} from "@shopify/react-native-skia";
import { useDerivedValue, type SharedValue } from "react-native-reanimated";
import { wallProgress } from "@/lib/sanctuary";

/**
 * The chapel on the hill. Drawn live on the GPU, in a soft isometric 3D: a front face,
 * a side face, stones that rise day by day, a door, stained glass, a roof, a cross, a
 * bell, and a path of candles (one per day prayed). The scene leans with the phone,
 * flames flicker, and the windows glow with the user's streak.
 */
const SKY = `
uniform float2 res; uniform float t; uniform float glow; uniform float2 tilt; uniform float groundY;
float hash(float2 p){ return fract(sin(dot(p, float2(127.1,311.7)))*43758.5453); }
half4 main(float2 p){
  float2 uv = p / res;
  float3 col = mix(float3(0.055,0.11,0.24), float3(0.012,0.025,0.07), smoothstep(0.0, 0.9, uv.y*0.9 + 0.2));
  // aurora: two slow bands
  float a = sin(uv.x*3.0 + t*0.15 + sin(uv.y*6.0 + t*0.1)) * 0.5 + 0.5;
  float band = exp(-pow((uv.y - 0.28 - 0.06*sin(uv.x*4.0 + t*0.2)) * 9.0, 2.0));
  col += float3(0.10, 0.35, 0.40) * band * a * 0.35;
  col += float3(0.30, 0.15, 0.45) * exp(-pow((uv.y - 0.40 - 0.05*cos(uv.x*3.0 - t*0.17)) * 11.0, 2.0)) * 0.22;
  // stars, two layers with parallax
  for (int l = 0; l < 2; l++) {
    float s = l == 0 ? 22.0 : 38.0;
    float2 q = (p + tilt * (l == 0 ? 10.0 : 24.0)) / s;
    float2 c = floor(q); float h = hash(c + float(l)*7.0);
    float2 o = float2(h, fract(h*17.3)) - 0.5;
    float d = length(fract(q) - 0.5 - o*0.7);
    float tw = 0.6 + 0.4*sin(t*(1.0 + h*2.5) + h*50.0);
    col += step(0.88, h) * smoothstep(0.08, 0.0, d) * tw * (1.0 - uv.y*0.6);
  }
  // warm glow rising from the chapel
  float2 g = (p - float2(res.x*0.5, groundY)) / res.y;
  col += float3(1.0, 0.72, 0.38) * exp(-dot(g,g)*7.0) * glow * 0.55;
  return half4(half3(col), 1.0);
}`;
const skyEffect = Skia.RuntimeEffect.Make(SKY);

export type ChapelProps = {
  width: number;
  height: number;
  /** y of the ground the chapel stands on (px). Hills, glow and candles follow it. */
  ground: number;
  days: number;
  pieces: Set<string>;
  newest: string | null;
  glow: SharedValue<number>;
  grow: SharedValue<number>;
  tiltX: SharedValue<number>;
  tiltY: SharedValue<number>;
  still?: boolean;
};

const GLASS = ["#c2334d", "#2e63b8", "#e0a53a", "#2f8a5a", "#7b4fa8", "#d9652f"];

export function Chapel({ width, height, ground, days, pieces, newest, glow, grow, tiltX, tiltY, still = false }: ChapelProps) {
  const clock = useClock();
  const uniforms = useDerivedValue(() => ({
    res: [width, height],
    t: still ? 30 : clock.value / 1000,
    glow: glow.value,
    tilt: [tiltX.value, tiltY.value],
    groundY: ground,
  }));

  // Scene geometry (in canvas px)
  const g = useMemo(() => {
    const groundY = ground;
    const fw = Math.min(136, width * 0.34); // front face width
    const sd = fw * 0.55; // side depth
    const rise = sd * 0.42; // isometric lift of the side face
    const x0 = width / 2 - fw / 2 - sd * 0.3;
    const fullWall = fw * 0.85;
    const wall = fullWall * wallProgress(days);
    const topY = groundY - wall;
    const gable = fw * 0.42;
    return { groundY, fw, sd, rise, x0, fullWall, wall, topY, gable, x1: x0 + fw };
  }, [width, height, ground, days]);

  const paths = useMemo(() => {
    const { groundY, fw, sd, rise, x0, x1, topY, gable } = g;
    const front = Skia.Path.Make();
    front.moveTo(x0, groundY); front.lineTo(x0, topY); front.lineTo(x1, topY); front.lineTo(x1, groundY); front.close();
    const side = Skia.Path.Make();
    side.moveTo(x1, groundY); side.lineTo(x1, topY); side.lineTo(x1 + sd, topY - rise); side.lineTo(x1 + sd, groundY - rise); side.close();
    const gablePath = Skia.Path.Make();
    gablePath.moveTo(x0 - 6, topY + 2); gablePath.lineTo(x0 + fw / 2, topY - gable); gablePath.lineTo(x1 + 6, topY + 2); gablePath.close();
    const roof = Skia.Path.Make();
    roof.moveTo(x0 + fw / 2, topY - gable); roof.lineTo(x1 + 6, topY + 2); roof.lineTo(x1 + 6 + sd, topY + 2 - rise); roof.lineTo(x0 + fw / 2 + sd, topY - gable - rise); roof.close();
    // Stones: rows on the front face, from the ground up to the current wall height
    const stones: { x: number; y: number; w: number; h: number }[] = [];
    const rowH = 11;
    const rows = Math.floor(g.wall / rowH);
    for (let r = 0; r < rows; r++) {
      const y = groundY - (r + 1) * rowH + 1;
      const offset = r % 2 ? 9 : 0;
      for (let x = x0 + 2 + offset; x < x1 - 2; x += 20) {
        stones.push({ x, y, w: Math.min(17, x1 - 2 - x), h: rowH - 2 });
      }
    }
    // Faint mortar lines on the side face
    const sideLines: ReturnType<typeof Skia.Path.Make>[] = [];
    for (let r = 1; r < Math.floor(g.wall / 11); r++) {
      const y = groundY - r * 11;
      const l = Skia.Path.Make(); l.moveTo(x1 + 1, y); l.lineTo(x1 + sd, y - rise); sideLines.push(l);
    }
    // Candles along a path in front of the door
    const candles: { x: number; y: number; s: number }[] = [];
    const n = Math.min(days, 14);
    for (let i = 0; i < n; i++) {
      const t = i / 13;
      const side2 = i % 2 ? 1 : -1;
      candles.push({ x: x0 + fw / 2 + side2 * (18 + t * fw * 0.6) + (i % 3) * 4, y: groundY + 12 + t * (height * 0.09), s: 0.75 + t * 0.45 });
    }
    // Door arch
    const dw = fw * 0.2, dh = Math.min(fw * 0.34, Math.max(0, g.wall - 6));
    const door = Skia.Path.Make();
    const dx = x0 + fw / 2 - dw / 2;
    door.moveTo(dx, groundY); door.lineTo(dx, groundY - dh + dw / 2); door.arcToOval(Skia.XYWHRect(dx, groundY - dh, dw, dw), 180, 180, false); door.lineTo(dx + dw, groundY); door.close();
    // Windows
    const ww = fw * 0.17, wh = fw * 0.3;
    const win = (wx: number, wy: number) => {
      const p = Skia.Path.Make();
      p.moveTo(wx, wy + wh); p.lineTo(wx, wy + ww / 2); p.arcToOval(Skia.XYWHRect(wx, wy, ww, ww), 180, 180, false); p.lineTo(wx + ww, wy + wh); p.close();
      return p;
    };
    const w1 = { x: x0 + fw * 0.16, y: topY + fw * 0.12 };
    const window1 = win(w1.x, w1.y);
    const w2 = { x: x1 + sd * 0.3, y: topY - rise * 0.45 + fw * 0.14 };
    const window2 = win(w2.x, w2.y);
    // Cross on the gable
    const cx = x0 + fw / 2, cy = topY - gable;
    const cross = Skia.Path.Make();
    cross.addRect(Skia.XYWHRect(cx - 2, cy - 30, 4, 28)); cross.addRect(Skia.XYWHRect(cx - 9, cy - 23, 18, 4));
    // Bell tower at the back right
    const bx = x1 + sd * 0.55, bw = fw * 0.22, bTop = topY - rise - fw * 0.5;
    const tower = Skia.Path.Make();
    tower.addRect(Skia.XYWHRect(bx, bTop, bw, groundY - rise - bTop));
    const towerRoof = Skia.Path.Make();
    towerRoof.moveTo(bx - 4, bTop); towerRoof.lineTo(bx + bw / 2, bTop - fw * 0.22); towerRoof.lineTo(bx + bw + 4, bTop); towerRoof.close();
    const bell = { x: bx + bw / 2, y: bTop + fw * 0.12 };
    // Ghost: the finished chapel's silhouette (walls at full height, roof, cross), faint, until it is built
    const fullTop = groundY - g.fullWall;
    const ghost = Skia.Path.Make();
    ghost.moveTo(x0, groundY); ghost.lineTo(x0, fullTop); ghost.lineTo(x0 - 6, fullTop + 2); ghost.lineTo(x0 + fw / 2, fullTop - gable);
    ghost.lineTo(x1 + 6, fullTop + 2); ghost.lineTo(x1 + 6 + sd, fullTop + 2 - rise); ghost.lineTo(x1 + sd, fullTop - rise); ghost.lineTo(x1 + sd, groundY - rise); ghost.lineTo(x1, groundY); ghost.close();
    ghost.addRect(Skia.XYWHRect(x0 + fw / 2 - 2, fullTop - gable - 30, 4, 28)); ghost.addRect(Skia.XYWHRect(x0 + fw / 2 - 9, fullTop - gable - 23, 18, 4));
    return { front, side, gablePath, roof, stones, candles, door, dw, dh, window1, window2, w1, w2, ww, wh, cross, tower, towerRoof, bell, cx, cy, ghost, sideLines };
  }, [g, days, height]);

  // Parallax layers follow the phone's tilt
  const farT = useDerivedValue(() => [{ translateX: tiltX.value * 6 }, { translateY: tiltY.value * 3 }]);
  const midT = useDerivedValue(() => [{ translateX: tiltX.value * 12 }, { translateY: tiltY.value * 6 }]);
  const nearT = useDerivedValue(() => [{ translateX: tiltX.value * 20 }, { translateY: tiltY.value * 10 }]);
  const flicker = useDerivedValue(() => (still ? 0.9 : 0.75 + 0.25 * Math.sin(clock.value / 90) * Math.sin(clock.value / 230 + 1.3)));
  const lightOpacity = useDerivedValue(() => glow.value);
  const haloOpacity = useDerivedValue(() => glow.value * 0.9);
  const flameOpacity = useDerivedValue(() => 0.55 + 0.45 * flicker.value);

  // The newest piece scales up from its anchor as `grow` runs 0 → 1 (hooks are called unconditionally)
  const usePiece = (name: string, ax: number, ay: number) =>
    useDerivedValue(() =>
      newest === name
        ? [{ translateX: ax }, { translateY: ay }, { scale: 0.001 + grow.value * 0.999 }, { translateX: -ax }, { translateY: -ay }]
        : [{ scale: 1 }],
    );
  const tRoof = usePiece("roof", g.x0 + g.fw / 2, g.topY);
  const tDoor = usePiece("door", g.x0 + g.fw / 2, g.groundY);
  const tWin1 = usePiece("window", paths.w1.x + paths.ww / 2, paths.w1.y + paths.wh);
  const tGlass = usePiece("glass", paths.w1.x + paths.ww / 2, paths.w1.y + paths.wh / 2);
  const tWin2 = usePiece("window2", paths.w2.x + paths.ww / 2, paths.w2.y + paths.wh);
  const tCross = usePiece("cross", paths.cx, paths.cy);
  const tBell = usePiece("bell", paths.bell.x, paths.bell.y - 30);
  const tFound = usePiece("foundation", g.x0 + g.fw / 2, g.groundY);

  if (!skyEffect) return null;
  const has = (p: string) => pieces.has(p);
  const stoneColor = "#2b3550";

  return (
    <Canvas style={{ width, height }} pointerEvents="none">
      <Fill>
        <Shader source={skyEffect} uniforms={uniforms} />
      </Fill>

      {/* Far hills */}
      <Group transform={farT}>
        <Oval x={-width * 0.2} y={g.groundY - height * 0.14} width={width * 0.9} height={height * 0.5} color="#0d1a36" />
        <Oval x={width * 0.4} y={g.groundY - height * 0.1} width={width * 0.9} height={height * 0.5} color="#0a1530" />
      </Group>

      {/* Halo of full light behind the chapel */}
      {has("halo") && (
        <Group opacity={haloOpacity}>
          <Circle cx={width / 2} cy={g.topY - g.gable * 0.6} r={g.fw * 1.4}>
            <RadialGradient c={vec(width / 2, g.topY - g.gable * 0.6)} r={g.fw * 1.4} colors={["rgba(255,226,160,0.75)", "rgba(255,200,110,0.25)", "rgba(255,200,110,0)"]} />
          </Circle>
        </Group>
      )}

      {/* The hill */}
      <Group transform={midT}>
        <Oval x={-width * 0.35} y={g.groundY - height * 0.03} width={width * 1.7} height={height * 0.6}>
          <LinearGradient start={vec(0, g.groundY)} end={vec(0, height)} colors={["#16304a", "#0b1a2e"]} />
        </Oval>
        {/* Window light spilling onto the grass */}
        <Group opacity={lightOpacity}>
          <Oval x={g.x0 - 10} y={g.groundY - 4} width={g.fw + 20} height={38} color="rgba(255,196,110,0.22)">
            <BlurMask blur={12} style="normal" />
          </Oval>
        </Group>

        {/* Bell tower (behind) */}
        {has("bell") && (
          <Group transform={tBell}>
            <Path path={paths.tower} color="#222b44" />
            <Path path={paths.towerRoof} color="#3a2a22" />
            <Circle cx={paths.bell.x} cy={paths.bell.y} r={g.fw * 0.06} color="#d9ab3f" />
            <Circle cx={paths.bell.x} cy={paths.bell.y + g.fw * 0.045} r={g.fw * 0.018} color="#8a620f" />
          </Group>
        )}

        {/* Ghost of the chapel to come */}
        {!has("halo") && <Path path={paths.ghost} color="rgba(240,214,154,0.16)" style="stroke" strokeWidth={1} />}

        {/* Walls */}
        <Group transform={tFound}>
          <Path path={paths.side} color="#1b2238" />
          {paths.sideLines.map((l, i) => (
            <Path key={i} path={l} color="rgba(255,255,255,0.05)" style="stroke" strokeWidth={1} />
          ))}
          <Path path={paths.front} color={stoneColor} />
          {paths.stones.map((s, i) => (
            <RoundedRect key={i} x={s.x} y={s.y} width={s.w} height={s.h} r={2} color={i % 5 === 0 ? "#3a4663" : "#333e5a"} />
          ))}
        </Group>

        {/* Door */}
        {has("door") && (
          <Group transform={tDoor}>
            <Path path={paths.door} color="#3b2412" />
            <Group opacity={lightOpacity}>
              <Path path={paths.door} color="rgba(255,190,100,0.55)" />
            </Group>
            <Circle cx={g.x0 + g.fw / 2 + paths.dw * 0.25} cy={g.groundY - paths.dh * 0.45} r={1.6} color="#d9ab3f" />
          </Group>
        )}

        {/* Front window */}
        {has("window") && (
          <Group transform={tWin1}>
            <Path path={paths.window1} color="#141a2c" />
            {has("glass") ? (
              <Group transform={tGlass}>
                {GLASS.map((c, i) => (
                  <Rect key={c} x={paths.w1.x + (i % 2) * (paths.ww / 2)} y={paths.w1.y + Math.floor(i / 2) * (paths.wh / 3)} width={paths.ww / 2} height={paths.wh / 3} color={c} />
                ))}
                <Path path={paths.window1} color="#141a2c" style="stroke" strokeWidth={2} />
                <Group opacity={lightOpacity}>
                  <Path path={paths.window1} color="rgba(255,230,170,0.7)">
                    <BlurMask blur={8} style="outer" />
                  </Path>
                </Group>
              </Group>
            ) : (
              <Group opacity={lightOpacity}>
                <Path path={paths.window1} color="rgba(255,200,120,0.75)" />
              </Group>
            )}
          </Group>
        )}

        {/* Side window */}
        {has("window2") && (
          <Group transform={tWin2}>
            <Path path={paths.window2} color="#141a2c" />
            <Group opacity={lightOpacity}>
              <Path path={paths.window2} color="rgba(255,200,120,0.8)" />
              <Path path={paths.window2} color="rgba(255,210,130,0.6)">
                <BlurMask blur={6} style="outer" />
              </Path>
            </Group>
          </Group>
        )}

        {/* Roof */}
        {has("roof") && (
          <Group transform={tRoof}>
            <Path path={paths.gablePath} color="#3a2a22" />
            <Path path={paths.roof} color="#4a362b" />
            <Path path={paths.roof} color="rgba(255,255,255,0.06)" style="stroke" strokeWidth={1} />
          </Group>
        )}

        {/* Cross */}
        {has("cross") && (
          <Group transform={tCross}>
            <Path path={paths.cross} color="#e6c168" />
            <Group opacity={lightOpacity}>
              <Path path={paths.cross} color="rgba(255,230,170,0.9)">
                <BlurMask blur={6} style="outer" />
              </Path>
            </Group>
          </Group>
        )}
      </Group>

      {/* Candles: one per day prayed */}
      <Group transform={nearT}>
        {paths.candles.map((c, i) => (
          <Group key={i}>
            <RoundedRect x={c.x - 2 * c.s} y={c.y - 10 * c.s} width={4 * c.s} height={10 * c.s} r={1} color="#efe3c8" />
            <Group opacity={flameOpacity}>
              <Oval x={c.x - 3 * c.s} y={c.y - 19 * c.s} width={6 * c.s} height={9 * c.s} color="#ffd27a" />
              <Circle cx={c.x} cy={c.y - 14 * c.s} r={7 * c.s} color="rgba(255,190,90,0.35)">
                <BlurMask blur={5} style="normal" />
              </Circle>
            </Group>
          </Group>
        ))}
      </Group>
    </Canvas>
  );
}
