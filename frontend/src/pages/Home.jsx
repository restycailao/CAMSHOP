import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Box, Button, Container, Typography, Badge, FormControl, Grid, Select, MenuItem } from "@mui/material";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
const colorPalette = {
  primary: '#000000',
  secondary: '#1a1a1a',
  accent: '#333333',
  text: {
    primary: '#ffffff', 
    secondary: '#e0e0e0' 
  },
  background: {
    main: '#0d0d0d',
    paper: '#1a1a1a'
  }
};
const Home = () => {
  const { keyword } = useParams();
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const loadingRef = useRef(null);
  const { data, isLoading, error, refetch } = useGetProductsQuery({ 
    keyword,
    page 
  });
  useEffect(() => {
    if (data && data.products) {
      if (page === 1) {
        setAllProducts(data.products);
      } else {
        setAllProducts(prev => [...prev, ...data.products]);
      }
    }
  }, [data, page]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && data && data.hasMore) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );
    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }
    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [data]);
  const dispatch = useDispatch();
  const addToCartHandler = async (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success("Item added to cart", {
      position: "top-right",
      autoClose: 2000,
    });
  };
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
    setAllProducts([]);
  };
  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: 'url("uploads/cam.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '80vh',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)'
          }
        }}
      >
        <Container
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            color={colorPalette.text.primary}
            sx={{ mb: 3, fontWeight: 'bold' }}
          >
            Lens Collection - 2019
          </Typography>
          
          <Typography
            variant="h6"
            color={colorPalette.text.secondary}
            sx={{ mb: 4, maxWidth: '600px' }}
          >
            A good photographer can shoot beautiful compositions with a crappy phone
            camera. But absolutely stunning works require exceptional equipments even for
            the most talented artist.
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/shop"
            sx={{
              backgroundColor: '#ff7043',
              '&:hover': {
                backgroundColor: '#f4511e'
              },
              width: 'fit-content',
              textTransform: 'none',
              px: 4,
              py: 1
            }}
          >
            SHOP NOW
          </Button>
        </Container>
      </Box>
      {/* Services Section */}
      <Container sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
          {/* Worldwide Delivery */}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            {/* Add your icon here */}
            <Typography variant="h6" sx={{ mb: 2, color: colorPalette.text.primary }}>
              Worldwide Delivery
            </Typography>
            <Typography variant="body1" color={colorPalette.text.secondary}>
              We arrange million of deliveries everyday throughout the world. You can
              rest assured that we got you covered
            </Typography>
          </Box>
          {/* 24/7 Customer Services */}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            {/* Add your icon here */}
            <Typography variant="h6" sx={{ mb: 2, color: colorPalette.text.primary }}>
              24/7 Customer Services
            </Typography>
            <Typography variant="body1" color={colorPalette.text.secondary}>
              Our dedicated support team guarantee to always support you - our beloved
              customer anytime of the day.
            </Typography>
          </Box>
          {/* Free Shipping */}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            {/* Add your icon here */}
            <Typography variant="h6" sx={{ mb: 2, color: colorPalette.text.primary }}>
              Free Shipping
            </Typography>
            <Typography variant="body1" color={colorPalette.text.secondary}>
              No shipping fee for delivery distance under 20km. And we can promise you
              the cheapest fee ever for additional km
            </Typography>
          </Box>
        </Box>
      </Container>
      {/* Featured Products Section */}
      <Box sx={{ width: '100%', py: 9, backgroundColor: colorPalette.background.main }}>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="error">{error?.data?.message || error.error}</Message>
        ) : (
          <Container maxWidth="xl">
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
                xl: 'repeat(5, 1fr)'
              },
              gap: 3,
              justifyItems: 'center',
              px: 2
            }}>
              {allProducts.map((product) => (
                <Box 
                  key={product._id}
                  sx={{
                    width: '100%',
                    maxWidth: '400px',
                    backgroundColor: colorPalette.background.paper,
                    borderRadius: 1,
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* Product Image - Clickable */}
                  <Link to={`/product/${product._id}`}>
                    <Box
                      component="img"
                      src={product.image || '/images/default-product.jpg'}
                      alt={product.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/default-product.jpg';
                      }}
                      sx={{
                        width: '100%',
                        height: '300px',
                        objectFit: 'contain',
                        backgroundColor: '#1e1e1e',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                  </Link>
                  {/* Product Info */}
                  <Box sx={{ p: 2 }}>
                    {/* Title and Brand */}
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="h6" sx={{ color: colorPalette.text.primary, mb: 0.5 }}>
                        {product.name}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: colorPalette.text.secondary }}>
                        Brand: {product.brand}
                      </Typography>
                    </Box>
                    {/* Price and Stock */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ color: '#ff7043' }}>
                        ${product.price}
                      </Typography>
                      <Badge 
                        badgeContent={product.countInStock > 0 ? 'In Stock' : 'Out of Stock'} 
                        color={product.countInStock > 0 ? 'success' : 'error'}
                      />
                    </Box>
                    {/* Add to Cart Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => addToCartHandler(product)}
                      disabled={product.countInStock === 0}
                      sx={{
                        backgroundColor: '#ff7043',
                        '&:hover': {
                          backgroundColor: '#f4511e'
                        },
                        '&:disabled': {
                          backgroundColor: '#666666',
                          color: '#999999'
                        }
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Container>
        )}
      </Box>
      {/* Loading indicator for infinite scroll */}
      <Box 
        ref={loadingRef} 
        sx={{ 
          height: '50px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          mt: 2 
        }}
      >
        {data?.hasMore && <Loader />}
      </Box>
    </>
  );
};
export default Home;