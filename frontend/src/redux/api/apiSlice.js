import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState, endpoint }) => {
    // If we're working with FormData, let the browser set the Content-Type
    if (['uploadProductImage', 'createProduct', 'updateProduct'].includes(endpoint)) {
      return headers;
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Order", "User", "Category", "Reviews"],
  endpoints: () => ({}),
});
