"use client";

import React from "react";
import { Link } from '@/i18n/navigation';

interface CardProps {
  title: string;
  content: React.ReactNode;
  link: string;
}

const Card: React.FC<CardProps> = ({ title, content, link }) => (
  <div className="relative bg-[#2D2D2D] rounded-sm overflow-hidden h-full max-w-full w-full transition-[box-shadow,border-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] border border-[#C9A962]/10 hover:border-[#C9A962]/30 hover:shadow-[0_8px_24px_-12px_rgba(61,46,32,0.22)] hover:-translate-y-0.5">
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 bg-[#1A1A1A]">
        <Link href={link} className="block" target="_self">
          <h3 className="text-lg font-medium text-[#F5F1EB] hover:text-[#C9A962] transition-colors duration-300 tracking-wide">{title}</h3>
        </Link>
      </div>
      <div className="flex-grow p-2">
        {content}
      </div>
    </div>
  </div>
);

export default Card;
