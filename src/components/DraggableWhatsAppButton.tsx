"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { useLocale } from "next-intl";

const DraggableWhatsAppButton = () => {
  const locale = useLocale();
  const controls = useAnimation();
  const constraintsRef = useRef(null);
  
  // Valores de posición para el arrastre
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  

  
  // Estado para controlar si el botón está siendo arrastrado o tocado
  const [isActive, setIsActive] = useState(false);
  
  // Referencia para el tamaño de la ventana
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  
  // Estado para controlar si estamos en el cliente
  const [isClient, setIsClient] = useState(false);

  // Inicializar el tamaño de la ventana y marcar que estamos en el cliente
  useEffect(() => {
    setIsClient(true);
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    // Inicializar el tamaño
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Función para adherir el botón a los bordes cuando se suelta
  const snapToEdge = (info: { point: { x: number; y: number } }) => {
    const buttonWidth = 60; // Ancho aproximado del botón
    const buttonHeight = 60; // Alto aproximado del botón
    
    // Calcular la posición final
    let finalX = info.point.x;
    let finalY = info.point.y;
    
    // Adherir a los bordes horizontales con un 20% dentro del borde
    if (finalX < windowSize.width / 2) {
      finalX = -33; // Izquierda (20% dentro)
    } else {
      finalX = windowSize.width - buttonWidth + 10; // Derecha (20% dentro)
    }
    
    // Limitar la posición vertical para que no se salga de la pantalla
    finalY = Math.max(20, Math.min(windowSize.height - buttonHeight - 20, finalY));
    
    controls.start({ x: finalX, y: finalY, transition: { type: "spring", stiffness: 300, damping: 25 } });
  };

  // Manejar el inicio del arrastre o toque
  const handleDragStart = () => {
    setIsActive(true);
  };

  // Manejar el fin del arrastre
  const handleDragEnd = (_event: any, info: { point: { x: number; y: number } }) => {
    setIsActive(false);
    snapToEdge(info);
  };
  
  // Manejar el hover o toque
  const handleHoverStart = () => {
    setIsActive(true);
  };
  
  const handleHoverEnd = () => {
    setIsActive(false);
  };

  // Número de WhatsApp formateado para el enlace
  const whatsappNumber = "50685850000";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  // Calcular la posición inicial solo en el cliente
  const initialX = isClient ? windowSize.width - 48 : 0; // 20% dentro del borde derecho
  const initialY = isClient ? windowSize.height / 2 - 30 : 0;
  
  return (
    <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-50">
      {isClient && (
        <motion.div
          className="absolute pointer-events-auto"
          style={{ x, y }}
          animate={controls}
          drag
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
          initial={{ x: initialX, y: initialY }}
          whileHover={{ scale: 1.1, opacity: 1 }}
          whileTap={{ scale: 0.95, opacity: 1 }}
        >
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-[60px] h-[60px] bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#128C7E] transition-all duration-300"
            style={{ 
              opacity: isActive ? 1 : 0.8,
              transform: `translateX(${isActive ? 0 : '12px'})`,
              transition: 'opacity 0.3s, transform 0.3s'
            }}
            aria-label={locale === 'es' ? 'Contactar por WhatsApp' : 'Contact via WhatsApp'}
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
            onTouchStart={handleHoverStart}
            onTouchEnd={handleHoverEnd}
          >
            <FaWhatsapp size={30} />
          </a>
        </motion.div>
      )}
    </div>
  );
};

export default DraggableWhatsAppButton;