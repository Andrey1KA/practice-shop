import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../types/product';
import type { RootState } from './store';

interface ProductsState {
  items: Product[];
}

const initialState: ProductsState = {
  items: [],
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.unshift(action.payload);
    },
  },
});

export const { addProduct, setProducts } = productsSlice.actions;

export const selectProducts = (state: RootState) => state.products.items;

export const productsReducer = productsSlice.reducer;
