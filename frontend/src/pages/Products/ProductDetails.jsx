import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaRegStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import { addToCart } from "../../redux/features/cart/cartSlice";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  IconButton,
  Grid,
  TextField,
  Tab,
  Tabs,
  Rating,
  styled,
  MobileStepper,
} from "@mui/material";
import { 
  KeyboardArrowLeft, 
  KeyboardArrowRight,
  Add, 
  Remove,
  NavigateBefore,
  NavigateNext
} from "@mui/icons-material";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1A1A1A',
  borderRadius: '0.5rem',
  padding: '2rem',
  height: '100%',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
}));

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '0.5rem',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  '& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ec4899',
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#ec4899',
  },
});

const StyledTab = styled(Tab)({
  color: 'white',
  '&.Mui-selected': {
    color: 'white',
    fontWeight: 600,
  },
  '&:hover': {
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});

const StyledButton = styled(Button)({
  backgroundColor: '#ec4899',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#be185d',
  },
  '&.Mui-disabled': {
    backgroundColor: 'rgba(236, 72, 153, 0.5)',
    color: 'rgba(255, 255, 255, 0.5)',
  },
});

const QuantityButton = styled(IconButton)({
  color: '#ec4899',
  backgroundColor: '#fff',
  borderRadius: '0.5rem',
  padding: '0.5rem',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  '&.Mui-disabled': {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    color: 'rgba(236, 72, 153, 0.5)',
  },
});

const InfoItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  '& .icon': {
    color: '#ec4899',
    fontSize: '1.25rem',
  },
  '& .label': {
    color: 'white',
    opacity: 0.7,
    fontSize: '0.875rem',
  },
  '& .value': {
    color: 'white',
    fontSize: '1rem',
  },
});

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [activeStep, setActiveStep] = useState(0);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  // Get all product images (main image + additional images)
  const allImages = product ? [product.image, ...(product.images || [])] : [];
  const maxSteps = allImages.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => 
      prevActiveStep === maxSteps - 1 ? 0 : prevActiveStep + 1
    );
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => 
      prevActiveStep === 0 ? maxSteps - 1 : prevActiveStep - 1
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    try {
      const result = await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      
      toast.success("Review added successfully");
      setRating(0);
      setComment("");
      refetch();
    } catch (error) {
      const errorMessage = error?.data?.message || 
        (error.status === 403 ? "You can only review products you have purchased and received" : 
         error.status === 400 ? "You have already reviewed this product" :
         "Error submitting review");
      
      toast.error(errorMessage);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const tabs = [
    { id: "description", label: "Description" },
    { id: "category", label: "Category Details" }
  ];

  const tabContent = {
    description: (
      <Typography variant="body1" color="white" sx={{ opacity: 0.7 }}>
        {product?.description}
      </Typography>
    ),
    category: (
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography color="white" sx={{ opacity: 0.7 }}>Category: {product?.category?.name}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography color="white" sx={{ opacity: 0.7 }}>Camera Type: {product?.category?.cameraType}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography color="white" sx={{ opacity: 0.7 }}>Sensor Size: {product?.category?.sensorSize}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography color="white" sx={{ opacity: 0.7 }}>Primary Use: {product?.category?.primaryUseCase}</Typography>
        </Grid>
      </Grid>
    )
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#121212' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ pt: 8, pb: 5 }}>
          <Button
            component={Link}
            to="/"
            startIcon={<KeyboardArrowLeft />}
            sx={{ 
              color: 'white',
              '&:hover': {
                textDecoration: 'underline',
              },
              mb: 4
            }}
          >
            Go Back
          </Button>

          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.message}
            </Message>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  {/* Left Column - Product Image Carousel */}
                  <Grid item xs={12} md={4}>
                    <StyledPaper sx={{ position: 'relative', height: '100%' }}>
                      <Box sx={{ position: 'relative' }}>
                        <Box
                          component="img"
                          src={allImages[activeStep]}
                          alt={`Product ${activeStep + 1}`}
                          sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: 1,
                            display: 'block',
                            overflow: 'hidden',
                            aspectRatio: '1',
                            objectFit: 'cover',
                          }}
                        />
                        
                        {/* Navigation Arrows */}
                        <IconButton
                          sx={{
                            position: 'absolute',
                            left: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            '&:hover': {
                              bgcolor: 'rgba(0, 0, 0, 0.7)',
                            },
                          }}
                          onClick={handleBack}
                          disabled={maxSteps <= 1}
                        >
                          <NavigateBefore />
                        </IconButton>
                        
                        <IconButton
                          sx={{
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            '&:hover': {
                              bgcolor: 'rgba(0, 0, 0, 0.7)',
                            },
                          }}
                          onClick={handleNext}
                          disabled={maxSteps <= 1}
                        >
                          <NavigateNext />
                        </IconButton>

                        {/* Image Dots */}
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 1,
                          }}
                        >
                          {allImages.map((_, index) => (
                            <Box
                              key={index}
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: index === activeStep ? '#ec4899' : 'rgba(255, 255, 255, 0.3)',
                                cursor: 'pointer',
                              }}
                              onClick={() => setActiveStep(index)}
                            />
                          ))}
                        </Box>
                      </Box>

                      {/* Thumbnail Preview */}
                      {maxSteps > 1 && (
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1,
                            mt: 2,
                            overflowX: 'auto',
                            '&::-webkit-scrollbar': {
                              height: 6,
                            },
                            '&::-webkit-scrollbar-track': {
                              bgcolor: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: 3,
                            },
                            '&::-webkit-scrollbar-thumb': {
                              bgcolor: 'rgba(255, 255, 255, 0.3)',
                              borderRadius: 3,
                              '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.4)',
                              },
                            },
                          }}
                        >
                          {allImages.map((image, index) => (
                            <Box
                              key={index}
                              component="img"
                              src={image}
                              alt={`Thumbnail ${index + 1}`}
                              onClick={() => setActiveStep(index)}
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: 1,
                                objectFit: 'cover',
                                cursor: 'pointer',
                                opacity: index === activeStep ? 1 : 0.6,
                                transition: 'opacity 0.2s',
                                '&:hover': {
                                  opacity: 0.8,
                                },
                              }}
                            />
                          ))}
                        </Box>
                      )}

                      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                        <HeartIcon product={product} />
                      </Box>
                    </StyledPaper>
                  </Grid>

                  {/* Middle Column - Product Details */}
                  <Grid item xs={12} md={4}>
                    <StyledPaper sx={{ height: '100%' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
                        <Typography variant="h4" component="h2" color="white" gutterBottom>
                          {product.name}
                        </Typography>
                        
                        <Typography variant="body1" color="white" sx={{ opacity: 0.7 }}>
                          {product.description}
                        </Typography>
                        
                        <Typography variant="h3" color="primary" fontWeight="bold">
                          $ {product.price}
                        </Typography>

                        <Grid container spacing={3}>
                          <Grid item xs={6}>
                            <InfoItem>
                              <FaStore className="icon" />
                              <Box>
                                <Typography className="label" color="white" sx={{ opacity: 0.7 }}>Brand</Typography>
                                <Typography className="value" color="white">{product.brand}</Typography>
                              </Box>
                            </InfoItem>
                          </Grid>
                          
                          <Grid item xs={6}>
                            <InfoItem>
                              <FaClock className="icon" />
                              <Box>
                                <Typography className="label" color="white" sx={{ opacity: 0.7 }}>Added</Typography>
                                <Typography className="value" color="white">{moment(product.createAt).fromNow()}</Typography>
                              </Box>
                            </InfoItem>
                          </Grid>
                          
                          <Grid item xs={6}>
                            <InfoItem>
                              <FaStar className="icon" />
                              <Box>
                                <Typography className="label" color="white" sx={{ opacity: 0.7 }}>Reviews</Typography>
                                <Typography className="value" color="white">{product.numReviews}</Typography>
                              </Box>
                            </InfoItem>
                          </Grid>
                          
                          <Grid item xs={6}>
                            <InfoItem>
                              <FaBox className="icon" />
                              <Box>
                                <Typography className="label" color="white" sx={{ opacity: 0.7 }}>In Stock</Typography>
                                <Typography className="value" color="white">{product.countInStock}</Typography>
                              </Box>
                            </InfoItem>
                          </Grid>
                        </Grid>

                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          borderTop: 1,
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          pt: 3,
                          mt: 'auto'
                        }}>
                          <Box sx={{ color: 'white' }}>
                            <Ratings
                              value={product.rating}
                              text={`${product.numReviews} reviews`}
                            />
                          </Box>

                          {product.countInStock > 0 && (
                            <Box sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              bgcolor: 'white',
                              borderRadius: 1,
                              border: 2,
                              borderColor: 'primary.main'
                            }}>
                              <QuantityButton
                                onClick={() => setQty(Math.max(1, qty - 1))}
                              >
                                <Remove />
                              </QuantityButton>
                              <Typography 
                                sx={{ 
                                  px: 2,
                                  color: 'black',
                                  fontWeight: 600,
                                  minWidth: '3rem',
                                  textAlign: 'center'
                                }}
                              >
                                {qty}
                              </Typography>
                              <QuantityButton
                                onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                              >
                                <Add />
                              </QuantityButton>
                            </Box>
                          )}
                        </Box>

                        <StyledButton
                          onClick={addToCartHandler}
                          disabled={product.countInStock === 0}
                          size="large"
                          sx={{ py: 1.5 }}
                        >
                          Add To Cart
                        </StyledButton>
                      </Box>
                    </StyledPaper>
                  </Grid>

                  {/* Right Column - Tabs */}
                  <Grid item xs={12} md={4}>
                    <StyledPaper sx={{ height: '100%' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Tabs
                          value={activeTab}
                          onChange={(e, newValue) => setActiveTab(newValue)}
                          orientation="horizontal"
                          variant="fullWidth"
                          sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            '& .MuiTabs-indicator': {
                              backgroundColor: '#ec4899',
                            },
                          }}
                        >
                          {tabs.map((tab) => (
                            <StyledTab
                              key={tab.id}
                              label={tab.label}
                              value={tab.id}
                              sx={{ 
                                color: 'white',
                                opacity: 0.7,
                                '&.Mui-selected': {
                                  color: 'white',
                                  opacity: 1
                                }
                              }}
                            />
                          ))}
                        </Tabs>
                        <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
                          {tabContent[activeTab]}
                        </Box>
                      </Box>
                    </StyledPaper>
                  </Grid>
                </Grid>
              </Grid>

              {/* Reviews Section */}
              <Grid item xs={12}>
                <StyledPaper>
                  <Typography variant="h5" color="white" gutterBottom>
                    Customer Reviews
                  </Typography>
                  {userInfo ? (
                    <Box component="form" onSubmit={submitHandler} sx={{ mt: 3 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" color="white" gutterBottom>
                            Rating <Typography component="span" color="primary">*</Typography>
                          </Typography>
                          <Rating
                            value={rating}
                            onChange={(e, newValue) => setRating(newValue)}
                            size="large"
                            sx={{
                              '& .MuiRating-icon': {
                                color: 'white',
                                opacity: 0.3
                              },
                              '& .MuiRating-iconEmpty': {
                                color: 'white',
                                opacity: 0.3
                              },
                              '& .MuiRating-iconFilled': {
                                color: 'white',
                                opacity: 1
                              },
                              '& .MuiRating-iconHover': {
                                color: 'white',
                                opacity: 0.7
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <StyledTextField
                            label="Review"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            multiline
                            rows={3}
                            required
                            fullWidth
                            placeholder="Share your experience with this product..."
                            InputLabelProps={{
                              sx: { color: 'white' }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <StyledButton
                            type="submit"
                            disabled={loadingProductReview}
                            fullWidth
                            size="large"
                          >
                            {loadingProductReview ? "Submitting..." : "Submit Review"}
                          </StyledButton>
                        </Grid>
                      </Grid>
                    </Box>
                  ) : (
                    <Typography color="white" sx={{ opacity: 0.7 }}>
                      Please <Link to="/login" style={{ color: '#ec4899', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>sign in</Link> to write a review.
                    </Typography>
                  )}

                  <Box sx={{ mt: 4 }}>
                    {product?.reviews?.length === 0 ? (
                      <Typography color="white" sx={{ opacity: 0.7 }}>
                        No reviews yet. Be the first to review this product!
                      </Typography>
                    ) : (
                      <Grid container spacing={3}>
                        {product?.reviews?.map((review) => (
                          <Grid item xs={12} md={6} key={review._id}>
                            <StyledPaper sx={{ height: '100%' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle1" color="white">
                                  {review.name}
                                </Typography>
                                <Typography variant="caption" color="white" sx={{ opacity: 0.7 }}>
                                  {moment(review.createdAt).fromNow()}
                                </Typography>
                              </Box>
                              <Rating 
                                value={review.rating} 
                                readOnly 
                                size="small"
                                sx={{
                                  '& .MuiRating-icon': {
                                    color: 'white',
                                    opacity: 0.3
                                  },
                                  '& .MuiRating-iconEmpty': {
                                    color: 'white',
                                    opacity: 0.3
                                  },
                                  '& .MuiRating-iconFilled': {
                                    color: 'white',
                                    opacity: 1
                                  }
                                }}
                              />
                              <Typography color="white" sx={{ mt: 1, opacity: 0.7 }}>
                                {review.comment}
                              </Typography>
                            </StyledPaper>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                </StyledPaper>
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ProductDetails;
