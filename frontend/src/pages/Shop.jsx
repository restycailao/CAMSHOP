import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { Box, Grid, Container, Pagination } from "@mui/material";
import {
  setCategories,
  setProducts,
  setChecked,
  setSelectedRating,
} from "../redux/features/shop/shopSlice";
import { addToCart } from "../redux/features/cart/cartSlice";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { toast } from "react-toastify";
import HeartIcon from "./Products/HeartIcon";
import Loader from "../components/Loader";

const ITEMS_PER_PAGE = 9; // 3x3 grid

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio, selectedRating } = useSelector(
    (state) => state.shop
  );
  const [page, setPage] = useState(1);
  
  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            // Filter by price
            const priceMatch = !priceFilter || 
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10);

            // Filter by rating - now checks for exact rating match
            const ratingMatch = !selectedRating || 
              (product.rating && Math.round(product.rating) === selectedRating);

            return priceMatch && ratingMatch;
          }
        );

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter, selectedRating]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
    setPage(1); // Reset to first page when filtering
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
    setPage(1); // Reset to first page when filtering
  };

  const handleRatingFilter = (rating) => {
    dispatch(setSelectedRating(rating === selectedRating ? 0 : rating));
    setPage(1); // Reset to first page when filtering
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
    setPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCartHandler = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  const renderStars = (rating, interactive = false) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && handleRatingFilter(star)}
            className={`text-xl ${
              star <= (interactive ? selectedRating : rating)
                ? "text-yellow-500"
                : "text-gray-400"
            } ${interactive ? "hover:text-yellow-500" : ""} transition-colors`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  // Calculate pagination
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen pt-[70px]"> 
      <div className="flex">
        {/* Sidebar */}
        <div className="bg-[#151515] w-[15rem] fixed left-0 top-[70px] bottom-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300" 
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#4B5563 #D1D5DB',
            zIndex: 1100 
          }}
        >
          <div className="sticky top-0 bg-[#151515] z-10">
            <h2 className="h4 text-center py-2 bg-black mb-2">
              Filter by Categories
            </h2>
          </div>

          <div className="px-4">
            {categories?.map((c) => (
              <div key={c._id} className="mb-2">
                <div className="flex items-center mr-4">
                  <input
                    type="checkbox"
                    id="red-checkbox"
                    onChange={(e) => handleCheck(e.target.checked, c._id)}
                    className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />

                  <label
                    htmlFor="pink-checkbox"
                    className="ml-2 text-sm font-medium text-white dark:text-gray-300"
                  >
                    {c.name}
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="sticky top-[48px] bg-[#151515] z-10">
            <h2 className="h4 text-center py-2 bg-black mb-2">
              Filter by Brands
            </h2>
          </div>

          <div className="px-4">
            {uniqueBrands?.map((brand) => (
              <div className="flex items-center mr-4 mb-5" key={brand}>
                <input
                  type="radio"
                  id={brand}
                  name="brand"
                  onChange={() => handleBrandClick(brand)}
                  className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />

                <label
                  htmlFor="pink-radio"
                  className="ml-2 text-sm font-medium text-white dark:text-gray-300"
                >
                  {brand}
                </label>
              </div>
            ))}
          </div>

          <div className="sticky top-[96px] bg-[#151515] z-10">
            <h2 className="h4 text-center py-2 bg-black mb-2">
              Filter by Price
            </h2>
          </div>

          <div className="px-4 w-full">
            <input
              type="text"
              placeholder="Enter Price"
              value={priceFilter}
              onChange={handlePriceChange}
              className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
            />
          </div>

          <div className="sticky top-[144px] bg-[#151515] z-10">
            <h2 className="h4 text-center py-2 bg-black mb-2">
              Filter by Rating
            </h2>
          </div>

          <div className="px-4 mb-4">
            <div className="flex flex-col space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingFilter(rating)}
                  className={`flex items-center space-x-2 p-2 rounded ${
                    selectedRating === rating
                      ? "bg-pink-600 bg-opacity-20"
                      : "hover:bg-pink-600 hover:bg-opacity-10"
                  }`}
                >
                  {renderStars(rating)}
                  <span className="text-white text-sm">stars only</span>
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 pb-4">
            <button
              className="w-full border my-4"
              onClick={() => {
                window.location.reload();
                setPage(1);
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Main Content */}
        <Container 
          maxWidth={false} 
          sx={{ 
            py: 4, 
            flexGrow: 1,
            pl: 4, 
            pr: 4, 
            maxWidth: 'calc(100% - 15rem)', 
            ml: '15rem',
            position: 'relative',
            zIndex: 1 
          }}
        >
          {filteredProductsQuery.isLoading ? (
            <Loader />
          ) : (
            <>
              <Grid container spacing={3}>
                {currentProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product._id}>
                    <div className="w-full h-full bg-[#1A1A1A] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col">
                      <section className="relative">
                        <Link to={`/product/${product._id}`}>
                          <img
                            className="cursor-pointer w-full rounded-t-lg"
                            src={product.image}
                            alt={product.name}
                            style={{ height: "300px", objectFit: "contain", width: "100%", backgroundColor: "#151515" }}
                          />
                        </Link>
                        <HeartIcon product={product} />
                      </section>

                      <div className="p-4 flex flex-col flex-grow space-y-3">
                        {/* Title and Brand */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                            <h5 className="text-lg font-medium text-white dark:text-white">{product?.name}</h5>
                            <span className="bg-pink-100 text-pink-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
                              {product?.brand}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-[#CFCFCF] line-clamp-2">
                          {product?.description}
                        </p>

                        {/* Price and Actions */}
                        <div className="flex justify-between items-center pt-2 mt-auto">
                          <p className="text-xl font-bold text-pink-500">
                            {product?.price?.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </p>
                          
                          <Link
                            to={`/product/${product._id}`}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
                          >
                            Details
                            <svg
                              className="w-3.5 h-3.5 ml-2"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 10"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                              />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: 'white',
                      },
                      '& .MuiPaginationItem-page.Mui-selected': {
                        backgroundColor: '#EC4899',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#BE185D',
                        },
                      },
                      '& .MuiPaginationItem-page:hover': {
                        backgroundColor: 'rgba(236, 72, 153, 0.2)',
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Container>
      </div>
    </div>
  );
};

export default Shop;
