import { apiSlice } from "./apiSlice";
import { PRODUCT_URL } from "../constants";

export const reviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllReviews: builder.query({
      query: () => ({
        url: `${PRODUCT_URL}/all-reviews`,
        method: "GET",
      }),
      providesTags: ["Reviews"],
      transformResponse: (response) => {
        return Array.isArray(response) ? response : [];
      },
    }),
    deleteReview: builder.mutation({
      query: ({ productId, reviewId }) => ({
        url: `${PRODUCT_URL}/${productId}/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews", "Products"],
    }),
  }),
});

export const { useGetAllReviewsQuery, useDeleteReviewMutation } = reviewApiSlice;
