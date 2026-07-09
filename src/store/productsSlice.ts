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
    removeProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((product) => product.id !== action.payload);
    },
  },
});

export const { addProduct, removeProduct, setProducts } = productsSlice.actions;

export const selectProducts = (state: RootState) => state.products.items;

export const productsReducer = productsSlice.reducer;
