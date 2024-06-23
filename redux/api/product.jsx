"use client";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../utils/common";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    add: builder.mutation({
      query: (data) => ({ url: `/addProduct`, method: "POST", body: data }),
    }),

    list: builder.query({
      query: (data) => ({
        url: `/listProduct/?search_text=${data.search_text}&category=${data.category}`,
        method: "GET",
      }),
    }),

    delete: builder.mutation({
      query: (data) => ({ url: `/delProduct?id=${data.id}&&owner=${data?.owner}`, method: "DELETE" }),  
    }),

    update: builder.mutation({
      query: (data) => ({ url: `/updateProduct`, method: "PUT", body: data }),
    }),
    
    byId: builder.mutation({
      query: (data) => ({ url: `/findById?id=${data.id}`, method: "GET"})
    }),

    categoryList :  builder.mutation({
      query: () => ({ url: `/categories`, method: "GET"})
    }),


  }),
});

const useAdd= productApi.endpoints.add.useMutation;
const useList = productApi.endpoints.list.useQuery;
const useDelete = productApi.endpoints.delete.useMutation;
const useFindbyId = productApi.endpoints.byId.useMutation;
const useUpdate = productApi.endpoints.update.useMutation;
const useCategories = productApi.endpoints.categoryList.useMutation;


export { useAdd, useList, useDelete,useFindbyId,useUpdate,useCategories};
