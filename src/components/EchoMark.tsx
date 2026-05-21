interface EchoMarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE: Record<NonNullable<EchoMarkProps['size']>, { width: number; height: number }> = {
  sm: { width: 110, height: 32 },
  md: { width: 156, height: 46 },
  lg: { width: 260, height: 80 },
};

export function EchoMark({ className = '', size = 'md' }: EchoMarkProps) {
  const dim = SIZE[size];
  return (
    <svg
      width={dim.width}
      height={dim.height}
      viewBox="0 0 400 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Echo"
      className={className}
    >
      <defs>
        <linearGradient id="echo-ring-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00E090" />
          <stop offset="100%" stopColor="#33E6A6" />
        </linearGradient>
      </defs>

      <circle cx={52} cy={60} r={10} fill="#00E090" />
      <circle
        cx={52}
        cy={60}
        r={20}
        fill="none"
        stroke="url(#echo-ring-grad)"
        strokeWidth={2.5}
        opacity={0.65}
      />
      <circle
        cx={52}
        cy={60}
        r={32}
        fill="none"
        stroke="#00E090"
        strokeWidth={1.5}
        opacity={0.28}
      />

      <text
        x={100}
        y={77}
        fontFamily="'DM Sans', 'Helvetica Neue', Arial, sans-serif"
        fontSize={48}
        fontWeight={700}
        letterSpacing="-1.5"
        fill="currentColor"
      >
        Echo
      </text>
    </svg>
  );
}
