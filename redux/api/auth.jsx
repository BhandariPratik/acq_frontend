"use client";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../utils/common";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (data) => ({ url: '/login', method: 'POST', body: data }),
    }),
    UserRegister: builder.mutation({
      query: (data) => ({ url: '/register', method: 'POST', body: data }),
    })
  }),
});

export const getAuth = authApi.endpoints.loginUser.useMutation;
export const UserRegister = authApi.endpoints.UserRegister.useMutation;
