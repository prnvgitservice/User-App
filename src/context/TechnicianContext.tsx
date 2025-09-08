import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllTechnicianDetails, getCartItems } from '../api/apiMethods';
import { TechnicianDetailsResponse } from '../screens/TechnicianProfile';

interface TechnicianContextType {
  technicianDetails: TechnicianDetailsResponse | null;
  cartItems: CartItem[];
  fetchTechnician: (technicianId: string) => Promise<void>;
  fetchCart: (userId: string) => Promise<void>;
}

const TechnicianContext = createContext<TechnicianContextType | undefined>(undefined);

export const TechnicianProvider = ({ children }: { children: React.ReactNode }) => {
  const [technicianDetails, setTechnicianDetails] = useState<TechnicianDetailsResponse | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const fetchTechnician = async (technicianId: string) => {
    try {
      const response = await getAllTechnicianDetails(technicianId);
      if (response?.success) {
        const result = response.result;
        const derivedServices = result.services.length > 0
          ? result.services
          : (result.technician.categoryServices || [])
              .filter((c: CategoryService) => c.status && c.details)
              .map((c: CategoryService) => c.details);
        setTechnicianDetails({
          ...result,
          services: derivedServices,
          ratings: Array.isArray(result.ratings) ? result.ratings : result.ratings ? [result.ratings] : [],
        });
      }
    } catch (err) {
      console.error('Failed to fetch technician details:', err);
    }
  };

  const fetchCart = async (userId: string) => {
    try {
      const response = await getCartItems(userId);
      if (response.success) {
        setCartItems(response.result.items.map((item: any) => ({
          id: item.serviceId,
          serviceId: item.serviceId,
          serviceName: item.serviceName || 'Unknown Service',
          servicePrice: item.servicePrice || 0,
          serviceImg: item.serviceImg || '',
          quantity: item.quantity,
          technicianId: item.technicianId,
        })));
      }
    } catch (err) {
      console.error('Failed to fetch cart items:', err);
    }
  };

  return (
    <TechnicianContext.Provider value={{ technicianDetails, cartItems, fetchTechnician, fetchCart }}>
      {children}
    </TechnicianContext.Provider>
  );
};

export const useTechnician = () => {
  const context = useContext(TechnicianContext);
  if (!context) throw new Error('useTechnician must be used within a TechnicianProvider');
  return context;
};