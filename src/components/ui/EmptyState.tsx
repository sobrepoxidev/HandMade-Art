import { Link } from '@/i18n/navigation';
import type { ReactNode } from 'react';

/**
 * Empty state primitive for "no items" surfaces (cart vacío, orders sin
 * pedidos, search sin resultados, favorites vacío). Replaces ad-hoc
 * `<p>No results</p>` patterns with a consistent visual treatment that
 * still feels artisan-premium, not generic SaaS.
 *
 * Example:
 *   <EmptyState
 *     icon={<ShoppingBag className="h-8 w-8" />}
 *     title="Tu carrito está vacío"
 *     description="Explorá el catálogo y encontrá una pieza única."
 *     cta={{ label: 'Ver catálogo', href: '/products' }}
 *   />
 */

interface CTA {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  cta?: CTA;
  secondaryCta?: CTA;
  className?: string;
}

function CTAButton({ cta, primary = true }: { cta: CTA; primary?: boolean }) {
  const classes = primary
    ? 'inline-flex items-center justify-center min-h-[48px] px-6 py-3 bg-[#C9A962] text-[#1A1A1A] text-sm font-semibold tracking-wide rounded-sm hover:bg-[#A08848] hover:text-[#F5F1EB] transition-colors'
    : 'inline-flex items-center justify-center min-h-[48px] px-6 py-3 bg-transparent border border-[#E8E4E0] text-[#2D2D2D] text-sm font-medium rounded-sm hover:border-[#A08848] hover:bg-white transition-colors';

  if (cta.href) {
    return (
      <Link href={cta.href} className={classes}>
        {cta.label}
      </Link>
    );
  }
  return (
    <button type="button" onClick={cta.onClick} className={classes}>
      {cta.label}
    </button>
  );
}

export default function EmptyState({
  icon,
  title,
  description,
  cta,
  secondaryCta,
  className = '',
}: EmptyStateProps) {
  return (
    <section
      className={`text-center py-14 px-6 bg-[#FAF8F5] border border-[#E8E4E0] rounded-md ${className}`}
    >
      {icon && (
        <div
          aria-hidden
          className="inline-flex items-center justify-center w-14 h-14 mb-5 rounded-full bg-[#C9A962]/12 text-[#A08848]"
        >
          {icon}
        </div>
      )}

      <h3 className="font-display text-xl sm:text-2xl font-medium text-[#2D2D2D] tracking-[-0.005em]">
        {title}
      </h3>

      {description && (
        <p className="mt-2 text-[#6B6459] max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      )}

      {(cta || secondaryCta) && (
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          {cta && <CTAButton cta={cta} primary />}
          {secondaryCta && <CTAButton cta={secondaryCta} primary={false} />}
        </div>
      )}
    </section>
  );
}
