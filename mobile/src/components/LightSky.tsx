import { Canvas, Fill, Shader, Skia, useClock } from "@shopify/react-native-skia";
import { StyleSheet } from "react-native";
import { useDerivedValue, type SharedValue } from "react-native-reanimated";

/**
 * Full-screen GPU sky: deep night gradient, twinkling stars (with parallax from the
 * phone's tilt), slowly turning rays of light from the door, and dust motes drifting
 * up through the light. `open` (0 → 1) floods the rays as the door opens.
 */
const SKSL = `
uniform float2 res;
uniform float2 center;
uniform float2 tilt;
uniform float t;
uniform float open;

float hash(float2 p) { return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }

half4 main(float2 p) {
  float2 v = p - center;
  float r = length(v) / res.y;
  float ang = atan(v.y, v.x);

  // Night sky: indigo near the door, almost black at the edges.
  float3 col = mix(float3(0.106, 0.165, 0.322), float3(0.016, 0.031, 0.078), smoothstep(0.0, 0.85, r));

  // Stars (two depth layers, shifted by phone tilt for real parallax).
  for (int layer = 0; layer < 2; layer++) {
    float s = layer == 0 ? 26.0 : 41.0;
    float2 q = (p + tilt * (layer == 0 ? 14.0 : 30.0)) / s;
    float2 cell = floor(q);
    float h = hash(cell + float(layer) * 17.0);
    float2 pos = float2(h, fract(h * 13.7)) - 0.5;
    float d = length(fract(q) - 0.5 - pos * 0.7);
    float tw = 0.55 + 0.45 * sin(t * (1.2 + h * 2.0) + h * 40.0);
    col += step(0.9, h) * smoothstep(0.07, 0.0, d) * tw * (0.9 - open * 0.6);
  }

  // Soft, volumetric rays of light from the door, slowly turning and breathing.
  float rays = pow(0.5 + 0.5 * sin(ang * 11.0 + t * 0.10), 3.0) * 0.55
             + pow(0.5 + 0.5 * sin(ang * 6.0 - t * 0.07 + 1.3), 4.0) * 0.45;
  rays *= 0.75 + 0.25 * sin(ang * 3.0 + t * 0.3);
  float fall = exp(-r * (3.4 - open * 1.2));
  float glow = exp(-r * (9.0 - open * 3.5));
  float3 gold = float3(1.0, 0.70, 0.30);
  float3 cream = float3(1.0, 0.95, 0.82);
  col += gold * rays * fall * (0.14 + open * 0.6);
  col += mix(gold, cream, glow) * glow * (0.20 + open * 0.95);

  // Keep the edges deep blue so the light glows instead of turning the sky grey.
  col *= mix(1.0, 0.45, smoothstep(0.45, 1.05, r));

  // Dust motes drifting upward, only visible inside the light.
  float2 m = (p + float2(0.0, t * 22.0)) / 34.0;
  float2 mc = floor(m);
  float mh = hash(mc + 3.1);
  float md = length(fract(m) - 0.5 - (float2(mh, fract(mh * 9.1)) - 0.5) * 0.6);
  float mote = step(0.72, mh) * smoothstep(0.09, 0.0, md);
  col += float3(1.0, 0.93, 0.75) * mote * exp(-r * 3.0) * (0.25 + open * 0.9);

  return half4(half3(col), 1.0);
}`;

const effect = Skia.RuntimeEffect.Make(SKSL);

type Props = {
  width: number;
  height: number;
  centerY: number;
  open: SharedValue<number>;
  tiltX: SharedValue<number>;
  tiltY: SharedValue<number>;
};

export function LightSky({ width, height, centerY, open, tiltX, tiltY }: Props) {
  const clock = useClock();
  const uniforms = useDerivedValue(() => ({
    res: [width, height],
    center: [width / 2 + tiltX.value * 8, centerY + tiltY.value * 8],
    tilt: [tiltX.value, tiltY.value],
    t: clock.value / 1000,
    open: open.value,
  }));

  if (!effect) return null;
  return (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      <Fill>
        <Shader source={effect} uniforms={uniforms} />
      </Fill>
    </Canvas>
  );
}
