// shortcut: decorative QR, not a scannable code; draw the real one when invitations have a real link.
const SIZE = 25;
const FINDERS = [
  [0, 0],
  [SIZE - 7, 0],
  [0, SIZE - 7],
];

function isDark(x: number, y: number): boolean {
  for (const [fx, fy] of FINDERS) {
    const dx = x - fx;
    const dy = y - fy;
    // Finder pattern plus its white margin.
    if (dx >= -1 && dx <= 7 && dy >= -1 && dy <= 7) {
      const ring = Math.max(Math.abs(dx - 3), Math.abs(dy - 3));
      return ring <= 1 || ring === 3;
    }
  }
  // Fixed pseudo-random fill so the drawing is the same on every render.
  return ((x * 73 + y * 151 + x * y * 31) ^ (x * 7 + y * 13)) % 9 < 4;
}

export function QrCode({ className = "w-52" }: { className?: string }) {
  const modules = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (isDark(x, y)) modules.push(<rect key={`${x}-${y}`} x={x} y={y} width="1.03" height="1.03" />);
    }
  }
  return (
    <svg role="img" aria-label="Código QR de la invitación" viewBox={`0 0 ${SIZE} ${SIZE}`} className={`fill-tinta ${className}`}>
      {modules}
    </svg>
  );
}
