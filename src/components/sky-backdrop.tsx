type Cloud = {
  top: string;
  w: number;
  h: number;
  dur: number;
  delay: number;
  far?: boolean;
  puffs: { left: string; top: string; w: string; h: string }[];
};

const CLOUDS: Cloud[] = [
  {
    top: "5%", w: 200, h: 42, dur: 160, delay: -25, far: true,
    puffs: [
      { left: "8%", top: "-70%", w: "48%", h: "160%" },
      { left: "44%", top: "-110%", w: "40%", h: "200%" },
    ],
  },
  {
    top: "15%", w: 320, h: 62, dur: 115, delay: -75,
    puffs: [
      { left: "4%", top: "-60%", w: "42%", h: "150%" },
      { left: "34%", top: "-125%", w: "46%", h: "215%" },
      { left: "68%", top: "-70%", w: "34%", h: "160%" },
    ],
  },
  {
    top: "29%", w: 170, h: 36, dur: 180, delay: -130, far: true,
    puffs: [{ left: "22%", top: "-95%", w: "52%", h: "185%" }],
  },
  {
    top: "40%", w: 400, h: 76, dur: 95, delay: -40,
    puffs: [
      { left: "2%", top: "-55%", w: "36%", h: "140%" },
      { left: "26%", top: "-130%", w: "42%", h: "225%" },
      { left: "56%", top: "-95%", w: "38%", h: "185%" },
      { left: "78%", top: "-50%", w: "26%", h: "130%" },
    ],
  },
  {
    top: "55%", w: 230, h: 46, dur: 140, delay: -100, far: true,
    puffs: [
      { left: "12%", top: "-80%", w: "44%", h: "170%" },
      { left: "50%", top: "-115%", w: "40%", h: "200%" },
    ],
  },
  {
    top: "66%", w: 350, h: 68, dur: 105, delay: -160,
    puffs: [
      { left: "6%", top: "-65%", w: "40%", h: "150%" },
      { left: "32%", top: "-120%", w: "44%", h: "210%" },
      { left: "66%", top: "-80%", w: "36%", h: "170%" },
    ],
  },
  {
    top: "78%", w: 190, h: 38, dur: 170, delay: -60, far: true,
    puffs: [{ left: "26%", top: "-100%", w: "50%", h: "190%" }],
  },
  {
    top: "88%", w: 450, h: 84, dur: 88, delay: -135,
    puffs: [
      { left: "3%", top: "-50%", w: "34%", h: "135%" },
      { left: "24%", top: "-125%", w: "40%", h: "220%" },
      { left: "54%", top: "-90%", w: "36%", h: "180%" },
      { left: "76%", top: "-55%", w: "28%", h: "140%" },
    ],
  },
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
        >
          {c.puffs.map((p, j) => (
            <i
              key={j}
              className={c.far ? "cloud-puff cloud-far-puff" : "cloud-puff"}
              style={{ left: p.left, top: p.top, width: p.w, height: p.h }}
            />
          ))}
        </span>
      ))}
    </div>
  );
}
