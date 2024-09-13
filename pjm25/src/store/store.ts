
import products from "@/store/reducer/products";
import { configureStore } from "@reduxjs/toolkit";
const store = configureStore({
  reducer: {
    products,
  },
});
export default store;
