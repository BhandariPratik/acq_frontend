"use client"
import { productApi } from "./api/product";
import { authApi } from "./api/auth";
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducers = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [productApi.reducerPath]: productApi.reducer
});
