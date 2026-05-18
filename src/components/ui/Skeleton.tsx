/**
 * Skeleton primitives — composable building blocks for loading states.
 * Replaces the ad-hoc `animate-pulse h-X bg-gray-200` patterns scattered
 * across cards, lists, orders and search.
 *
 * Usage:
 *   <Skeleton.Line className="w-1/3" />
 *   <Skeleton.Box className="aspect-square" />
 *   <Skeleton.Avatar size="md" />
 *   <Skeleton.Image className="aspect-[4/5]" />
 */

interface BaseProps {
  className?: string;
  /** Pass `false` to disable the pulse animation (useful inside Suspense fallbacks). */
  animated?: boolean;
}

const baseClasses = (animated: boolean) =>
  `bg-[#E8E4E0] rounded-sm ${animated ? 'animate-pulse' : ''}`;

function Line({ className = '', animated = true }: BaseProps) {
  return (
    <span
      aria-hidden
      className={`block h-4 w-full ${baseClasses(animated)} ${className}`}
    />
  );
}

function Box({ className = '', animated = true }: BaseProps) {
  return (
    <div
      aria-hidden
      className={`${baseClasses(animated)} ${className}`}
    />
  );
}

function Image({ className = '', animated = true }: BaseProps) {
  return (
    <div
      aria-hidden
      className={`bg-[#FAF8F5] border border-[#E8E4E0]/70 rounded-sm ${animated ? 'animate-pulse' : ''} ${className}`}
    />
  );
}

type AvatarSize = 'sm' | 'md' | 'lg';
const AVATAR_SIZES: Record<AvatarSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
};

function Avatar({ size = 'md', animated = true, className = '' }: BaseProps & { size?: AvatarSize }) {
  return (
    <div
      aria-hidden
      className={`rounded-full ${AVATAR_SIZES[size]} ${baseClasses(animated)} ${className}`}
    />
  );
}

export const Skeleton = {
  Line,
  Box,
  Image,
  Avatar,
};

export default Skeleton;
