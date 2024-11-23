import { useState } from "react";
import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import { Pagination, Box, Grid, Container } from "@mui/material";
import Product from "./Product";

const ITEMS_PER_PAGE = 8;

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);
  const [page, setPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = favorites.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-[70px]"> {/* Add padding for navbar */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <h1 className="text-2xl font-bold">
            FAVORITE PRODUCTS ({favorites.length})
          </h1>
        </Box>

        <Grid container spacing={3}>
          {currentProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <Box sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '& .product-image': {
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover'
                }
              }}>
                <Product product={product} />
              </Box>
            </Grid>
          ))}
        </Grid>

        {totalPages > 1 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mt: 4
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
  );
};

export default Favorites;
