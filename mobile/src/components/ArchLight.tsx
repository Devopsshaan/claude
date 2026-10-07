import { BlurMask, Canvas, Group, LinearGradient, Path, RadialGradient, Rect, Skia, vec } from "@shopify/react-native-skia";
import { useDerivedValue, type SharedValue } from "react-native-reanimated";

/**
 * What is behind the door: warm light and a figure of Jesus standing in it with open
 * arms, drawn as light without a face (the same figure as oneprayer.church). The
 * figure fades in and rises as the door opens (`reveal` 0 → 1) and breathes softly.
 */
const FIGURE = {
  veil: "M84 50 C 82 70, 80 86, 74 100 L 126 100 C 120 86, 118 70, 116 50 C 112 38, 88 38, 84 50 Z",
  robe: "M74 100 C 88 92, 112 92, 126 100 C 131 132, 134 170, 138 212 C 144 272, 151 332, 160 396 L 40 396 C 49 332, 56 272, 62 212 C 66 170, 69 132, 74 100 Z",
  armL: "M78 106 C 64 122, 50 142, 36 170 C 33 177, 36 184, 44 184 C 51 183, 56 177, 60 171 C 70 156, 80 144, 90 134 Z",
  armR: "M122 106 C 136 122, 150 142, 164 170 C 167 177, 164 184, 156 184 C 149 183, 144 177, 140 171 C 130 156, 120 144, 110 134 Z",
  mantle: "M76 104 C 98 140, 118 186, 138 226 L 134 246 C 112 202, 92 162, 70 124 Z",
  folds: "M92 210 C 88 270, 84 330, 80 392 M108 214 C 112 272, 118 332, 124 392 M100 232 C 100 290, 100 340, 100 392",
};
const p = (d: string) => Skia.Path.MakeFromSVGString(d)!;
const PATHS = {
  veil: p(FIGURE.veil),
  robe: p(FIGURE.robe),
  armL: p(FIGURE.armL),
  armR: p(FIGURE.armR),
  mantle: p(FIGURE.mantle),
  folds: p(FIGURE.folds),
  head: Skia.Path.MakeFromSVGString("M100 38 A 14 18 0 1 1 99.99 38 Z")!,
  handL: Skia.Path.MakeFromSVGString("M38 182 A 6 7 0 1 1 37.99 182 Z")!,
  handR: Skia.Path.MakeFromSVGString("M162 182 A 6 7 0 1 1 161.99 182 Z")!,
};

type Props = { width: number; height: number; reveal: SharedValue<number>; breath: SharedValue<number> };

export function ArchLight({ width, height, reveal, breath }: Props) {
  // Figure is drawn in a 200×400 box, scaled to 78% of the arch width and standing on the floor.
  const scale = (width * 0.78) / 200;
  const figW = 200 * scale;
  const figH = 400 * scale;
  const baseX = (width - figW) / 2;
  const baseY = height - figH * 0.99;

  const figureTransform = useDerivedValue(() => {
    const rise = (1 - reveal.value) * figH * 0.08;
    const s = scale * (0.96 + 0.04 * reveal.value) * (1 + breath.value * 0.012);
    return [{ translateX: baseX + (figW - 200 * s) / 2 }, { translateY: baseY + rise }, { scale: s }];
  });
  const figureOpacity = useDerivedValue(() => reveal.value);
  const haloOpacity = useDerivedValue(() => 0.35 + 0.65 * reveal.value);

  return (
    <Canvas style={{ width, height }} pointerEvents="none">
      {/* The light itself */}
      <Rect x={0} y={0} width={width} height={height}>
        <RadialGradient c={vec(width / 2, height * 0.4)} r={height * 0.75} colors={["#fffaf0", "#ffe7b0", "#f5c56e", "#6b4a1c"]} positions={[0, 0.35, 0.62, 1]} />
      </Rect>
      {/* Halo behind the figure */}
      <Group opacity={haloOpacity}>
        <Rect x={0} y={0} width={width} height={height}>
          <RadialGradient c={vec(width / 2, height * 0.33)} r={width * 0.55} colors={["rgba(255,252,240,0.95)", "rgba(255,227,163,0.35)", "rgba(255,227,163,0)"]} />
        </Rect>
      </Group>
      {/* The figure: brighter than the light around it, so it stays visible when the light floods. */}
      <Group transform={figureTransform} opacity={figureOpacity}>
        <Group>
          <BlurMask blur={10} style="solid" />
          <Path path={PATHS.robe}>
            <LinearGradient start={vec(0, 90)} end={vec(0, 400)} colors={["#ffffff", "#fff6dc", "#f7dfa0"]} />
          </Path>
          <Path path={PATHS.armL} color="#fff1cf" />
          <Path path={PATHS.armR} color="#fff1cf" />
          <Path path={PATHS.veil} color="#f6dfa8" />
          <Path path={PATHS.head} color="#ffffff" />
          <Path path={PATHS.handL} color="#ffffff" />
          <Path path={PATHS.handR} color="#ffffff" />
        </Group>
        <Path path={PATHS.mantle} color="#d9ab3f" opacity={0.35} />
        <Path path={PATHS.folds} color="#c9a457" style="stroke" strokeWidth={1.8} strokeCap="round" opacity={0.45} />
      </Group>
    </Canvas>
  );
}
