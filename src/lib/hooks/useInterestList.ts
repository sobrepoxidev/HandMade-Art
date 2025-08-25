'use client';

import { useState, useEffect, useCallback } from 'react';

export interface InterestItem {
  product_id: number;
  qty: number;
  name: string;
  sku?: string;
  main_image_url?: string;
  price?: number; // Este es el precio en dólares
  dolar_price?: number;
  discount_percentage?: number;
}

const STORAGE_KEY = 'catalog_interest_list';

export function useInterestList() {
  const [items, setItems] = useState<InterestItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar desde localStorage al montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading interest list from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Guardar en localStorage cuando cambie la lista
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Error saving interest list to localStorage:', error);
      }
    }
  }, [items, isLoaded]);

  const addItem = useCallback((product: Omit<InterestItem, 'qty'>) => {
    setItems(current => {
      const existingIndex = current.findIndex(item => item.product_id === product.product_id);
      
      if (existingIndex >= 0) {
        // Si ya existe, incrementar cantidad
        const updated = [...current];
        updated[existingIndex] = {
          ...updated[existingIndex],
          qty: updated[existingIndex].qty + 1
        };
        return updated;
      } else {
        // Si no existe, agregar nuevo
        return [...current, { ...product, qty: 1 }];
      }
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems(current => current.filter(item => item.product_id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, newQty: number) => {
    if (newQty <= 0) {
      removeItem(productId);
      return;
    }

    setItems(current => {
      const index = current.findIndex(item => item.product_id === productId);
      if (index >= 0) {
        const updated = [...current];
        updated[index] = { ...updated[index], qty: newQty };
        return updated;
      }
      return current;
    });
  }, [removeItem]);

  const clearList = useCallback(() => {
    setItems([]);
  }, []);

  const getItem = useCallback((productId: number) => {
    return items.find(item => item.product_id === productId);
  }, [items]);

  const isInList = useCallback((productId: number) => {
    return items.some(item => item.product_id === productId);
  }, [items]);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.qty, 0);
  }, [items]);

  return {
    items,
    isLoaded,
    addItem,
    removeItem,
    updateQuantity,
    clearList,
    getItem,
    isInList,
    getTotalItems,
    itemCount: items.length
  };
}