"use client";

import React from "react";
import { Link } from '@/i18n/navigation';

interface CardProps {
  title: string;
  content: React.ReactNode;
  link: string;
}

const Card: React.FC<CardProps> = ({ title, content, link }) => (
  <div className="relative bg-[#2D2D2D] rounded-lg overflow-hidden h-full max-w-full w-full hover:shadow-lg transition-all duration-300 border border-[#C9A962]/10 hover:border-[#C9A962]/30">
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 bg-gradient-to-b from-[#2D2D2D] to-[#1A1A1A]">
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
