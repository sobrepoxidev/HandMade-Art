/**
 * Unified loading indicator for Handmade Art.
 * Use everywhere we need to show "this is doing something" — replaces the
 * ad-hoc `animate-spin border-t-2 border-teal-600` patterns sprinkled
 * across account, search, drawers and forms.
 */

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<SpinnerSize, string> = {
  xs: 'h-3 w-3 border',
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
  xl: 'h-10 w-10 border-[3px]',
};

interface SpinnerProps {
  size?: SpinnerSize;
  /** Accessible label announced by screen readers. Defaults to "Loading…" */
  label?: string;
  /** Override the active-segment color (defaults to gold-dark). */
  tone?: 'gold' | 'cream';
  className?: string;
}

export default function Spinner({
  size = 'md',
  label = 'Loading',
  tone = 'gold',
  className = '',
}: SpinnerProps) {
  const sizeClasses = SIZE_MAP[size];
  const toneClasses =
    tone === 'gold'
      ? 'border-[#E8E4E0]/40 border-t-[#A08848]'
      : 'border-[#F5F1EB]/30 border-t-[#F5F1EB]';

  return (
    <span
      role="status"
      aria-live="polite"
      className={`inline-flex items-center justify-center ${className}`}
    >
      <span
        aria-hidden
        className={`inline-block rounded-full animate-spin ${sizeClasses} ${toneClasses}`}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
