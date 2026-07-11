import { useRef, useEffect } from "react";

/** 아침 햇살 속 부드러운 초록 빛 입자가 위로 떠오르는 캔버스 */
export default function LeafField() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = c.getContext("2d");
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    let W = 0, H = 0, raf = 0;
    const N = 18;
    const motes = [];
    const mk = (spread) => ({
      x: Math.random() * W,
      y: spread ? Math.random() * H : H + 12,
      r: 1.6 + Math.random() * 3.6,
      s: 0.15 + Math.random() * 0.5,
      sway: Math.random() * Math.PI * 2,
      sw: 0.4 + Math.random() * 1.1,
      a: 0.12 + Math.random() * 0.32,
    });
    const resize = () => {
      const r = c.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      c.width = W * DPR; c.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      for (const m of motes) { if (m.x > W) m.x = Math.random() * W; }
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const m of motes) {
        m.y -= m.s;
        m.sway += 0.01 * m.sw;
        const x = m.x + Math.sin(m.sway) * 14;
        const g = ctx.createRadialGradient(x, m.y, 0, x, m.y, m.r * 3);
        g.addColorStop(0, `rgba(123,198,126,${m.a})`);
        g.addColorStop(1, "rgba(123,198,126,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, m.y, m.r * 3, 0, Math.PI * 2);
        ctx.fill();
        if (m.y < -12) Object.assign(m, mk(false));
      }
      raf = requestAnimationFrame(draw);
    };
    resize();
    for (let i = 0; i < N; i++) motes.push(mk(true));
    draw();
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} className="leaf-field" aria-hidden="true" />;
}
