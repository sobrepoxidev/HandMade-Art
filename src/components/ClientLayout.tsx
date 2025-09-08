"use client";

import { ReactNode } from 'react';
import DraggableWhatsAppButton from './DraggableWhatsAppButton';

interface Props {
  children?: ReactNode;
}

export default function ClientLayout({ children }: Props = {}) {
  return (
    <>
      {children}
      <DraggableWhatsAppButton />
    </>
  );
}