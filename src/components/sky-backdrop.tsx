const CLOUDS = [
  { top: "6%", w: 220, h: 54, dur: 150, delay: -20, far: true },
  { top: "14%", w: 320, h: 74, dur: 110, delay: -70, far: false },
  { top: "27%", w: 180, h: 44, dur: 170, delay: -120, far: true },
  { top: "38%", w: 400, h: 88, dur: 95, delay: -35, far: false },
  { top: "52%", w: 240, h: 58, dur: 135, delay: -95, far: true },
  { top: "63%", w: 340, h: 78, dur: 105, delay: -155, far: false },
  { top: "76%", w: 200, h: 48, dur: 160, delay: -55, far: true },
  { top: "86%", w: 460, h: 96, dur: 88, delay: -130, far: false },
];

export function SkyBackdrop() {
  return (
    <div className="sky-field" aria-hidden="true">
      {CLOUDS.map((c, i) => (
        <span
          key={i}
          className={c.far ? "cloud cloud-far" : "cloud"}
          style={{
            top: c.top,
            width: `${c.w}px`,
            height: `${c.h}px`,
            animationDuration: `${c.dur}s`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
