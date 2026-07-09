import { useCallback } from 'react';
import { createProductRequest, fetchProducts } from '../api/products';
import { addProduct, selectProducts, setProducts } from '../store/productsSlice';
import { useAppDispatch, useAppSelector } from './useStore';

export function useProducts() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);

  const loadProducts = useCallback(async () => {
    const items = await fetchProducts();
    dispatch(setProducts(items));
  }, [dispatch]);

  const createProduct = useCallback(
    async (payload: FormData) => {
      const product = await createProductRequest(payload);
      dispatch(addProduct(product));
      return product;
    },
    [dispatch],
  );

  return {
    createProduct,
    loadProducts,
    products,
  };
}
