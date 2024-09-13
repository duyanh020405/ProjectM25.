import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
//   addProducts,
//   deleteProducts,
//   editProducts,
  getAllProducts,
} from "@/app/service/products.service";

export const TangItem: any = createAsyncThunk(
  "products/TangItem",
  async (user: any) => {
    const updateResponse = await axios.put(
      `http://localhost:8080/users/${user.id}`,
      user
    );
    return updateResponse.data;
  }
);
export const GiamItem: any = createAsyncThunk(
  "products/GiamItem",
  async (user: any) => {
    const updateResponse = await axios.put(
      `http://localhost:8080/users/${user.id}`,
      user
    );
    return updateResponse.data;
  }
);
export const DeleteItem: any = createAsyncThunk(
  "products/DeleteItem",
  async (user: any) => {
    const updateResponse = await axios.put(
      `http://localhost:8080/users/${user.id}`,
      user
    );
    return updateResponse.data;
  }
);
export const buyItem: any = createAsyncThunk(
  "products/buyItem",
  async (user: any) => {
    const updateResponse = await axios.put(
      `http://localhost:8080/users/${user.id}`,
      user
    );
    return updateResponse.data;
  }
);


const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.products = action.payload; // Assuming payload is an array of products
      })
    //   .addCase(addProducts.fulfilled, (state: any, action: any) => {
    //     state.products.push(action.payload); // Assuming payload is the added product
    //   })
    //   .addCase(editProducts.fulfilled, (state: any, action) => {
    //     const updatedProduct = action.payload; // Assuming payload is the updated product
    //     const index = state.products.findIndex(
    //       (item: any) => item.id === updatedProduct.id
    //     );
    //     if (index !== -1) {
    //       state.products[index] = updatedProduct;
    //     }
    //   })
      .addCase(TangItem.fulfilled, (state: any, action) => {
        console.log(state);
        const updatedProduct = action.payload;
        const index = state.products.findIndex(
          (item: any) => item.id === updatedProduct.id
        );
        if (index !== -1) {
          state.products[index].quantity = updatedProduct.quantity;
        }
      })
      .addCase(DeleteItem.fulfilled,(state, action)=>{

      })
      .addCase(GiamItem.fulfilled, (state: any, action) => {
        console.log(state);
        const updatedProduct = action.payload;
        const index = state.products.findIndex(
          (item: any) => item.id === updatedProduct.id
        );
        if (index !== -1) {
          state.products[index].quantity = updatedProduct.quantity;
        }
      })
  },
});

export default productsSlice.reducer;
