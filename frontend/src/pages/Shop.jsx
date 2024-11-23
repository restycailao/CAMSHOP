import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { Box, Grid, Container, Pagination } from "@mui/material";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const ITEMS_PER_PAGE = 9; // 3x3 grid

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
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
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10)
            );
          }
        );

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

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

  // Calculate pagination
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen pt-[70px]"> 
      <div className="flex">
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
          <Box sx={{ mb: 4 }}>
            <h2 className="h4 text-center mb-4">
              {products?.length} Products
            </h2>
          </Box>

          <Grid 
            container 
            spacing={2} 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '1rem', 
              minHeight: '1000px', 
              '& > .MuiGrid-item': {
                width: '100%',
                maxWidth: '100%',
                flexBasis: '100%',
                padding: '0 !important'
              }
            }}
          >
            {products.length === 0 ? (
              <Grid item xs={12}>
                <Loader />
              </Grid>
            ) : (
              currentProducts?.map((p) => (
                <Grid item key={p._id}>
                  <Box sx={{ height: '100%' }}>
                    <ProductCard p={p} />
                  </Box>
                </Grid>
              ))
            )}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              mt: 4,
              position: 'sticky', 
              bottom: 20,
              '& .MuiPagination-ul .MuiPaginationItem-root': {
                color: '#fff', 
                borderColor: 'rgba(255, 255, 255, 0.23)', 
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                },
                '&.Mui-selected': {
                  backgroundColor: '#f472b6', 
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#f472b6',
                  },
                },
              }
            }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </Container>
      </div>
    </div>
  );
};

export default Shop;
