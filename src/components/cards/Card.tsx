"use client";

import React from "react";
import { Link } from '@/i18n/navigation';

interface CardProps {
  title: string;
  content: React.ReactNode;
  link: string;
}

const Card: React.FC<CardProps> = ({ title, content, link }) => (
  <div className="relative bg-[#161210] rounded-sm overflow-hidden h-full max-w-full w-full transition-[box-shadow,border-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] border border-[#E0A83A]/10 hover:border-[#E0A83A]/30 hover:shadow-[0_8px_24px_-12px_rgba(61,46,32,0.22)] hover:-translate-y-0.5">
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 bg-[#0F0C0A]">
        <Link href={link} className="block" target="_self">
          <h3 className="text-lg font-medium text-[#F1E7D6] hover:text-[#E0A83A] transition-colors duration-300 tracking-wide">{title}</h3>
        </Link>
      </div>
      <div className="flex-grow p-2">
        {content}
      </div>
    </div>
  </div>
);

export default Card;
