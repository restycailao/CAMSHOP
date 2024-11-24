import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  IconButton,
  Divider,
} from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1A1A1A',
  color: 'white',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
}));

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const updateQuantity = (item, newQty) => {
    if (newQty > 0 && newQty <= item.countInStock) {
      addToCartHandler(item, newQty);
    }
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#121212', py: 8 }}>
      <Container maxWidth="xl">
        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h5" color="white" gutterBottom>
              Your cart is empty
            </Typography>
            <Button
              component={Link}
              to="/shop"
              variant="contained"
              sx={{
                bgcolor: '#ec4899',
                '&:hover': {
                  bgcolor: '#be185d',
                },
                mt: 2
              }}
            >
              Go To Shop
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {/* Cart Items */}
            <Grid item xs={12}>
              <Typography variant="h4" color="white" gutterBottom>
                Shopping Cart
              </Typography>
              <Box 
                sx={{ 
                  mt: 3,
                  maxHeight: '60vh',
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#ec4899',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: '#be185d',
                  }
                }}
              >
                {cartItems.map((item) => (
                  <StyledPaper key={item._id} sx={{ mb: 2 }}>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: 1,
                            maxHeight: 150,
                            objectFit: 'cover'
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Link 
                          to={`/product/${item._id}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#ec4899',
                              '&:hover': {
                                color: '#be185d'
                              }
                            }}
                          >
                            {item.name}
                          </Typography>
                        </Link>
                        <Typography color="white" sx={{ opacity: 0.7, mt: 1 }}>
                          {item.brand}
                        </Typography>
                        <Typography color="white" sx={{ fontWeight: 'bold', mt: 1 }}>
                          $ {item.price}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconButton
                            onClick={() => updateQuantity(item, item.qty - 1)}
                            disabled={item.qty <= 1}
                            sx={{ 
                              color: 'white',
                              '&.Mui-disabled': {
                                color: 'rgba(255, 255, 255, 0.3)'
                              }
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography color="white" sx={{ mx: 2, minWidth: 20, textAlign: 'center' }}>
                            {item.qty}
                          </Typography>
                          <IconButton
                            onClick={() => updateQuantity(item, item.qty + 1)}
                            disabled={item.qty >= item.countInStock}
                            sx={{ 
                              color: 'white',
                              '&.Mui-disabled': {
                                color: 'rgba(255, 255, 255, 0.3)'
                              }
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <IconButton
                          onClick={() => removeFromCartHandler(item._id)}
                          sx={{ 
                            color: '#ef4444',
                            '&:hover': {
                              color: '#dc2626'
                            }
                          }}
                        >
                          <FaTrash />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </StyledPaper>
                ))}
              </Box>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12}>
              <Box sx={{ 
                maxWidth: '500px', 
                margin: '0 auto',
                mt: 4
              }}>
                <StyledPaper>
                  <Typography variant="h5" gutterBottom>
                    Order Summary
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography color="white" sx={{ opacity: 0.7 }}>
                        Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                      </Typography>
                      <Typography color="white" fontWeight="bold">
                        $ {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                      </Typography>
                    </Box>
                    <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={cartItems.length === 0}
                      onClick={checkoutHandler}
                      sx={{
                        bgcolor: '#ec4899',
                        '&:hover': {
                          bgcolor: '#be185d',
                        },
                        '&.Mui-disabled': {
                          bgcolor: 'rgba(236, 72, 153, 0.3)',
                        },
                        py: 1.5,
                        mt: 2
                      }}
                    >
                      Proceed To Checkout
                    </Button>
                  </Box>
                </StyledPaper>
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Cart;
