/* eslint-disable @next/next/no-img-element */
interface EchoMarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE: Record<NonNullable<EchoMarkProps['size']>, { width: number; height: number }> = {
  sm: { width: 96, height: 28 },
  md: { width: 132, height: 40 },
  lg: { width: 260, height: 80 },
};

export function EchoMark({ className = '', size = 'md' }: EchoMarkProps) {
  const dim = SIZE[size];
  return (
    <img
      src="/echo-logo.svg"
      alt="Echo"
      width={dim.width}
      height={dim.height}
      className={className}
    />
  );
}
