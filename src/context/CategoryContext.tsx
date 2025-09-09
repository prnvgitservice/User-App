import React, { createContext, useState, useEffect } from 'react';
import { getAllCategories } from '../api/apiMethods';

interface Category {
  _id: string;
  category_name: string;
  category_slug: string;
  category_image: string;
  meta_title: string;
  meta_description: string;
  status: number;
  totalviews: number;
  ratings: number | null;
}

interface CategoryContextType {
  categories: Category[];
  error: string | null;
  loading: boolean;
}

export const CategoryContext = createContext<CategoryContextType>({
  categories: [],
  error: null,
  loading: false,
});

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setAllCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getAllCategories();
      if (response.success === true && Array.isArray(response.data)) {
        setAllCategories(response.data);
      } else {
        setError('Invalid response format');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, error, loading }}>
      {children}
    </CategoryContext.Provider>
  );
};