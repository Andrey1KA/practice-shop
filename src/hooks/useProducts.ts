import { useCallback } from 'react';
import { createProductRequest, deleteProductRequest, fetchProducts } from '../api/products';
import { addProduct, removeProduct, selectProducts, setProducts } from '../store/productsSlice';
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

  const deleteProduct = useCallback(
    async (id: string) => {
      await deleteProductRequest(id);
      dispatch(removeProduct(id));
    },
    [dispatch],
  );

  return {
    createProduct,
    deleteProduct,
    loadProducts,
    products,
  };
}
