import React from 'react';
import dynamic from 'next/dynamic';

// Importación dinámica del componente cliente con SSR deshabilitado
const CarouselClient = dynamic(
  () => import('./CarouselClient'),
  { ssr: false }
);

export interface CarrucelItem {
  title: string;
  content: React.ReactNode;
  link: string;
  className?: string;
  start?: boolean;
  end?: boolean;
}

interface CarrucelSectionProps {
  items: CarrucelItem[];
}

const CarrucelSectionA: React.FC<CarrucelSectionProps> = ({ items }) => {
  return (
    <div className="lg:hidden relative ">
      <CarouselClient items={items} />
    </div>
  );
};

export default CarrucelSectionA;