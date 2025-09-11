import React from 'react';
import { Link } from '@/i18n/navigation';


interface BannerTemplateProps {
  children: React.ReactNode;
  linkHref?: string;
  bgColor?: string;
}

const BannerTemplate: React.FC<BannerTemplateProps> = ({ children, linkHref = '#', bgColor = '' }) => (
  <div className={`relative h-full w-full ${bgColor}`}>
    {children}
    <Link href={linkHref} className="absolute top-0 left-0 right-0 h-full z-30" />
  </div>
);

export default BannerTemplate;