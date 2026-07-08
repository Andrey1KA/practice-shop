import { useCallback } from 'react';
import {
  addItem as addCartItem,
  clear as clearCart,
  removeItem as removeCartItem,
  selectCartItems,
  selectCartTotalCount,
  selectCartTotalPrice,
} from '../store/cartSlice';
import type { Product } from '../types/product';
import { useAppDispatch, useAppSelector } from './useStore';

export function useCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totalCount = useAppSelector(selectCartTotalCount);
  const totalPrice = useAppSelector(selectCartTotalPrice);

  const addItem = useCallback(
    (product: Product) => {
      dispatch(addCartItem(product));
    },
    [dispatch],
  );

  const removeItem = useCallback(
    (productId: string) => {
      dispatch(removeCartItem(productId));
    },
    [dispatch],
  );

  const clear = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return {
    items,
    addItem,
    removeItem,
    clear,
    totalCount,
    totalPrice,
  };
}
