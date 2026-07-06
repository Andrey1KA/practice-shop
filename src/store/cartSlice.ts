import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '../types/cart';
import type { Product } from '../types/product';
import type { RootState } from './store';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find((item) => item.product.id === action.payload.id);

      if (existing) {
        existing.quantity += 1;
        return;
      }

      state.items.push({ product: action.payload, quantity: 1 });
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
    },
    clear: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, clear } = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartTotalCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartTotalPrice = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

export const cartReducer = cartSlice.reducer;
