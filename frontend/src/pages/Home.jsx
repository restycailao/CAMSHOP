import { Link, useParams } from "react-router-dom";
import { Box, Button, Container, Typography, Badge, FormControl, Select, MenuItem } from "@mui/material";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "./Products/Product";

const colorPalette = {
  primary: '#000000',
  secondary: '#1a1a1a',
  accent: '#333333',
  text: {
    primary: '#ffffff',
    secondary: '#b3b3b3'
  },
  background: {
    main: '#0d0d0d',
    paper: '#1a1a1a'
  }
};

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

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
            // backdropFilter: 'blur(2px)',
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
            color="white"
            sx={{ mb: 3, fontWeight: 'bold' }}
          >
            Lens Collection - 2019
          </Typography>
          
          <Typography
            variant="h6"
            color="white"
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
            <Typography variant="h6" sx={{ mb: 2 }}>
              Worldwide Delivery
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We arrange million of deliveries everyday throughout the world. You can
              rest assured that we got you covered
            </Typography>
          </Box>

          {/* 24/7 Customer Services */}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            {/* Add your icon here */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              24/7 Customer Services
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Our dedicated support team guarantee to always support you - our beloved
              customer anytime of the day.
            </Typography>
          </Box>

          {/* Free Shipping */}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            {/* Add your icon here */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Free Shipping
            </Typography>
            <Typography variant="body1" color="text.secondary">
              No shipping fee for delivery distance under 20km. And we can promise you
              the cheapest fee ever for additional km
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* Featured Products Section */}
      <Container maxWidth="lg" sx={{ py: 8, backgroundColor: colorPalette.background.main }}>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message variant="danger">
            {isError?.data.message || isError.error}
          </Message>
        ) : (
          <>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 4
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography 
                  variant="h5" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 500,
                    color: colorPalette.text.primary 
                  }}
                >
                  Featured Equipment
                </Typography>
                <Typography variant="body2" sx={{ color: colorPalette.text.secondary }}>
                  {data.products.length} items
                </Typography>
              </Box>

              <FormControl sx={{ minWidth: 200 }}>
                <Select
                  value="category"
                  displayEmpty
                  variant="outlined"
                  size="small"
                  sx={{
                    backgroundColor: colorPalette.background.paper,
                    color: colorPalette.text.primary,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: colorPalette.accent
                    }
                  }}
                >
                  <MenuItem value="category">Category</MenuItem>
                  <MenuItem value="cameras">Cameras</MenuItem>
                  <MenuItem value="lenses">Lenses</MenuItem>
                  <MenuItem value="accessories">Accessories</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 3
            }}>
              {data.products.map((product) => (
                <Box 
                  key={product._id}
                  sx={{
                    backgroundColor: colorPalette.background.paper,
                    borderRadius: 1,
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  {/* Sale Badge */}
                  {product.isOnSale && (
                    <Badge
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        backgroundColor: '#ff4444',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: 1,
                        fontSize: '0.875rem'
                      }}
                    >
                      Sale
                    </Badge>
                  )}

                  {/* Product Image - Clickable */}
                  <Link to={`/product/${product._id}`}>
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.name}
                      sx={{
                        width: '100%',
                        height: 'auto',
                        aspectRatio: '1',
                        objectFit: 'contain',
                        padding: 2,
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                  </Link>

                  {/* Product Info */}
                  <Box sx={{ p: 2 }}>
                    <Link 
                      to={`/product/${product._id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: 1,
                          color: colorPalette.text.primary,
                          '&:hover': {
                            color: colorPalette.text.secondary
                          }
                        }}
                      >
                        {product.name}
                      </Typography>
                    </Link>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 2,
                        color: colorPalette.text.secondary 
                      }}
                    >
                      {product.description}
                    </Typography>

                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Button
                        variant="contained"
                        onClick={() => addToCartHandler(product)}
                        sx={{
                          backgroundColor: colorPalette.primary,
                          color: colorPalette.text.primary,
                          '&:hover': {
                            backgroundColor: colorPalette.secondary
                          }
                        }}
                      >
                        Add to Cart
                      </Button>

                      <Link 
                        to={`/product/${product._id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: colorPalette.text.primary,
                              fontWeight: 500,
                              '&:hover': {
                                color: colorPalette.text.secondary
                              }
                            }}
                          >
                            ${product.price}
                          </Typography>
                          {product.isOnSale && (
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                textDecoration: 'line-through',
                                color: colorPalette.text.secondary 
                              }}
                            >
                              ${product.originalPrice}
                            </Typography>
                          )}
                        </Box>
                      </Link>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Container>
    </>
  );
};

export default Home;