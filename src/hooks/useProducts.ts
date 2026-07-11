import { useCallback } from 'react';
import { createProductRequest, deleteProductRequest, fetchProducts, updateProductRequest } from '../api/products';
import { addProduct, removeProduct, selectProducts, setProducts, updateProduct as updateProductAction } from '../store/productsSlice';
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

  const updateProduct = useCallback(
    async (id: string, payload: FormData) => {
      const product = await updateProductRequest(id, payload);
      dispatch(updateProductAction(product));
      return product;
    },
    [dispatch],
  );

  return {
    createProduct,
    deleteProduct,
    loadProducts,
    products,
    updateProduct,
  };
}
