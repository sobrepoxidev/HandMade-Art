// ----------------------------------------
// src/components/gallery/ClientComponents.tsx
// ----------------------------------------
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

// Swiper y módulos
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Database } from "@/types-db";
import { ProductCardModal } from "./ProductModal";



type Product = Database['products'];

// ---------------------------------------------------------
// 1) Tipos e iconos
// ---------------------------------------------------------
export interface MediaItem {
  type: "image" | "video";
  url: string;
  caption?: string;
}

interface OpenGalleryModalEventDetail {
  product: Product;
}

interface ExpandIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}



function ExpandIcon({ className, ...props }: ExpandIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
      aria-hidden="true"
    >
      <path d="M15 3h6v6" />
      <path d="M9 21H3v-6" />
      <path d="M21 3l-7 7" />
      <path d="M3 21l7-7" />
    </svg>
  );
}

interface CloseIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

function CloseIcon({ className, ...props }: CloseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

// ---------------------------------------------------------
// 2) Botón de expandir (abre el modal)
// ---------------------------------------------------------
export function ExpandButton({
  product
}: {
  product: Product;
}) {
  const searchParams = useSearchParams();
const pathname = usePathname();
const { replace } = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); 

    const params = new URLSearchParams(searchParams);
    params.set("id", product.id.toString());
    const url = `${pathname}?${params.toString()}`;
    replace(url);

    // Evento custom tipado
    const event = new CustomEvent<OpenGalleryModalEventDetail>(
      "openGalleryModal",
      {
        detail: {
          product: product,
        },
      }
    );

    window.dispatchEvent(event);
  };

  return (
    <button
      className="absolute top-3 right-3 z-50 bg-black/70 bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition-all duration-200 transform hover:scale-110"
      onClick={handleClick}
      aria-label="Ver en pantalla completa"
      title="Ver en pantalla completa"
    >
      <ExpandIcon />
    </button>
  );
}

// ---------------------------------------------------------
// 3) Card individual para cada MediaItem (imagen o video)
// ---------------------------------------------------------
interface MediaItemCardProps {
  product: Product;
  activeExpandButton: boolean;
}

function MediaItemCard({ product, activeExpandButton }: MediaItemCardProps) {
  return (
    <div className="relative w-full h-full ">

      {activeExpandButton && (
        <ExpandButton product={product} />
      )}

      {product.media && product.media[0]?.type === "image" ? (
        <div className="relative w-full h-full ">
          <Image
            src={product.media[0].url}
            alt={product.name ?? ""}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain scale-125 "
            loading="lazy"
          />
        </div>
      ) : (
        <video
          className="w-full h-full object-cover bg-teal-100"
          preload="none"
          controls
          poster="/video-thumbnail.jpg"
        >
          <source src={(product.media?.[0]?.url ?? '/default-video.mp4')} type="video/mp4" />
          Tu navegador no soporta video HTML5.
        </video>
      )}

      {/* {item.caption && (
        <div className="absolute bottom-3 left-3 right-3 bg-black/20 text-white text-sm px-4 py-2 rounded-md">
          {item.caption}
        </div>
      )} */}
    </div>
  );
}

// ---------------------------------------------------------
// 4) Carrusel con Swiper (Client Component)
// ---------------------------------------------------------
interface MediaCarouselProps {
  product: Product;
  activeExpandButton: boolean;
}
export function MediaCarousel({ product, activeExpandButton }: MediaCarouselProps) {
  return (
    <div className="relative w-full" style={activeExpandButton ? { aspectRatio: "4/3" } : { height: "100%" }}>
  <Swiper
    modules={[Navigation, Pagination]}
    navigation
    pagination={{ clickable: true }}
    className="h-full w-full"
    loop={product.media ? product.media.length > 1 : false}
  >
    {product.media?.map((item, index) => (
      <SwiperSlide key={index} className="flex items-center justify-center h-full">
        <MediaItemCard
          product={product}
          activeExpandButton={activeExpandButton}
        />
      </SwiperSlide>
    ))}
  </Swiper>
</div>
  );
}

// ---------------------------------------------------------
// 5) Modal de galería en pantalla completa
// ---------------------------------------------------------
export function FullscreenModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    // Evita scroll en body mientras modal está abierto
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full sm:max-w-7xl sm:max-h-[95vh] bg-white sm:rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {/* Pass the improved ProductModal with fullscreenMode enabled */}
        <ProductCardModal
          product={product}
          activeExpandButton={false}
          fullscreenMode={true}
        />
      </div>
    </div>
  );
}
interface GalleryModalProps {
  initialProduct?: Product | null; // Nueva prop opcional
}
// ---------------------------------------------------------
// 6) Modal global que escucha el evento 'openGalleryModal'
// ---------------------------------------------------------
export function GalleryModal({ initialProduct }: GalleryModalProps) {
  const [modalContent, setModalContent] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({ isOpen: false, product: null });

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const closeModal = () => {
    console.log("Cerrando modal..."); // Log para depuración
    const params = new URLSearchParams(searchParams.toString());
    params.delete("id");
    const url = `${pathname}?${params.toString()}`;
    replace(url, { scroll: false });
    setModalContent({ isOpen: false, product: null });
  };

  // --- Efecto 1: Abrir modal SI initialProduct se proporciona Y coincide con la URL inicial ---
  // Este efecto ahora SOLO depende de initialProduct. Se ejecutará si esa prop cambia.
  useEffect(() => {
    // Obtiene el ID de la URL *en el momento en que este efecto se ejecuta*
    const urlId = searchParams.get('id');
    console.log(`Efecto 1 (initialProduct): initialProduct=`, initialProduct ? initialProduct.id : 'null', `urlId=${urlId}`);

    // Si tenemos la prop initialProduct, y coincide con el ID en la URL actual...
    if (initialProduct && urlId === initialProduct.id.toString()) {
        // ... y el modal NO está ya abierto (para evitar bucles si algo más lo abre)...
        if (!modalContent.isOpen) {
            console.log("Efecto 1: Abriendo modal basado en initialProduct coincidente.");
            setModalContent({ isOpen: true, product: initialProduct });
        } else {
             console.log("Efecto 1: initialProduct coincide con URL, pero modal ya está abierto.");
        }
    }
    // IMPORTANTE: Depender solo de initialProduct. No queremos que este efecto
    // se vuelva a ejecutar solo porque la URL cambió al cerrar el modal.
  }, [initialProduct]); // <--- Solo depende de initialProduct

  // --- Efecto 2: Listener para el evento custom (para el botón Expand) ---
  // Este efecto maneja la apertura por evento y necesita reaccionar a cambios en searchParams/isOpen
  useEffect(() => {
    const handleOpenModal = (event: Event) => {
      // Prevenir si ya está abierto
      if (modalContent.isOpen) {
          console.log("Evento openGalleryModal ignorado: modal ya abierto.");
          return;
      }

      const customEvent = event as CustomEvent<OpenGalleryModalEventDetail>;
      const productToOpen = customEvent.detail.product;
      console.log(`Evento openGalleryModal recibido para producto ID: ${productToOpen.id}`);

      setModalContent({
        isOpen: true,
        product: productToOpen,
      });

      // Asegurar que la URL se actualice (ExpandButton ya lo hace, pero es buena práctica aquí también)
      const params = new URLSearchParams(searchParams.toString());
      params.set("id", productToOpen.id.toString());
      // Comprobar si la URL ya tiene el ID correcto para evitar un replace innecesario
      if (searchParams.get('id') !== productToOpen.id.toString()) {
         console.log("Efecto 2: Actualizando URL por evento.");
         replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    };

    console.log("Efecto 2: Añadiendo listener para openGalleryModal");
    window.addEventListener("openGalleryModal", handleOpenModal as EventListener);

    return () => {
      console.log("Efecto 2: Eliminando listener para openGalleryModal");
      window.removeEventListener("openGalleryModal", handleOpenModal as EventListener);
    };
    // Dependencias: Necesita saber si está abierto para evitar reapertura,
    // y necesita las funciones de routing/params para actualizar URL si es necesario.
  }, [modalContent.isOpen, pathname, replace, searchParams]);


  // Renderizado condicional
  if (!modalContent.isOpen || !modalContent.product) {
    // console.log("Render: Modal no está abierto o no tiene producto."); // Mucho log, quitar si funciona
    return null;
  }

  // console.log("Render: Renderizando FullscreenModal."); // Mucho log, quitar si funciona
  return (
    <FullscreenModal
      product={modalContent.product}
      onClose={closeModal}
    />
  );
}
