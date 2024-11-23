import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

export const apiSlice = createApi({
  baseQuery,
  //dadagdagan pag gusto mo mag fetch ng data 
  tagTypes: ["Product", "Order", "User", "Category", "Reviews"],
  endpoints: () => ({}),
});
