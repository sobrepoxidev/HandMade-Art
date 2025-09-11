"use client";

import React from "react";
import { Link } from '@/i18n/navigation';

interface CardProps {
  title: string;
  content: React.ReactNode;
  link: string;
}

const Card: React.FC<CardProps> = ({ title, content, link }) => (
  <div className="relative bg-[#303030]  rounded-xs overflow-hidden starting: h-full max-w-full w-full  hover:shadow-sm transition-shadow">
    <div className="flex flex-col h-full">
      <div className="px-3 bg-gradient-to-b from-[#303030] to-transparent">
        <Link href={link} className="block" target="_self">
          <h3 className="text-lg font-semibold text-white hover:text-teal-600 transition-colors">{title}</h3>
        </Link>
      </div>
      <div className="flex-grow p-2">
        {content}
      </div>
    </div>
  </div>
);

export default Card;