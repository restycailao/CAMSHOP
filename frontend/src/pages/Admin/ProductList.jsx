import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useAllProductsQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

const ProductList = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const [createProduct] = useCreateProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        name,
        description,
        price: Number(price),
        category,
        quantity: Number(quantity),
        brand,
        countInStock: Number(stock),
        images: images
      };

      const result = await createProduct(productData).unwrap();
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is created`);
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      console.error('Product creation error:', err);
      toast.error(err?.data?.message || "Product creation failed. Try again");
    }
  };

  const uploadFileHandler = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('image', file);
    });

    try {
      const res = await uploadProductImage(formData).unwrap();
      if (res.error) {
        throw new Error(res.error);
      }
      
      // Handle multiple images response
      const newImages = Array.isArray(res.images) ? res.images : [res.image];
      setImages(prev => [...prev, ...newImages]);
      toast.success('Images uploaded successfully');
    } catch (err) {
      console.error('Upload error:', err);
      if (err.name === 'TimeoutError') {
        toast.error('Upload timed out. Please try with smaller images or check your connection.');
      } else {
        toast.error(err?.data?.message || err.message || 'Failed to upload images');
      }
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Box sx={{ backgroundColor: '#121212', minHeight: '100vh' }}>
      <Grid container>
        <Grid item xs={12} md={2}>
          <AdminMenu />
        </Grid>
        
        <Grid item xs={12} md={10}>
          <Box sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
            minHeight: '100vh'
          }}>
            <Typography variant="h4" sx={{ color: 'white', mb: 4, textAlign: 'center' }}>
              Create Product
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Grid container spacing={4}>
                {/* Image Upload Section */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.05)', 
                    p: 4,
                    borderRadius: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <Box sx={{ 
                      width: '100%',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                      gap: 2,
                      mb: 4
                    }}>
                      {images.length > 0 ? (
                        images.map((image, index) => (
                          <Box 
                            key={index} 
                            sx={{ 
                              position: 'relative',
                              width: '100%',
                              paddingTop: '100%',
                              borderRadius: '8px',
                              overflow: 'hidden'
                            }}
                          >
                            <img
                              src={image}
                              alt={`product-${index}`}
                              style={{ 
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                            <IconButton
                              onClick={() => removeImage(index)}
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                bgcolor: 'rgba(0, 0, 0, 0.5)',
                                '&:hover': {
                                  bgcolor: 'rgba(0, 0, 0, 0.7)'
                                }
                              }}
                              size="small"
                            >
                              <Delete sx={{ color: 'white', fontSize: 20 }} />
                            </IconButton>
                          </Box>
                        ))
                      ) : (
                        <Box sx={{ 
                          width: '100%',
                          height: '300px',
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gridColumn: '1 / -1'
                        }}>
                          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            No images uploaded
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    
                    <Button
                      variant="contained"
                      component="label"
                      sx={{ 
                        width: '100%',
                        bgcolor: 'primary.main',
                        '&:hover': { bgcolor: 'primary.dark' }
                      }}
                    >
                      Upload Images
                      <input
                        type="file"
                        name="images"
                        accept="image/*"
                        onChange={uploadFileHandler}
                        multiple
                        hidden
                      />
                    </Button>
                  </Box>
                </Grid>

                {/* Product Details Section */}
                <Grid item xs={12} md={6}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Name"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{
                          input: { color: 'white' },
                          label: { color: 'rgba(255, 255, 255, 0.7)' },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                            '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        variant="outlined"
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{
                          textarea: { color: 'white' },
                          label: { color: 'rgba(255, 255, 255, 0.7)' },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                            '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Price"
                        type="number"
                        variant="outlined"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        sx={{
                          input: { color: 'white' },
                          label: { color: 'rgba(255, 255, 255, 0.7)' },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                            '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        sx={{
                          select: { color: 'white' },
                          label: { color: 'rgba(255, 255, 255, 0.7)' },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                            '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                          }
                        }}
                      >
                        {categories?.map((cat) => (
                          <MenuItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        variant="outlined"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        sx={{
                          input: { color: 'white' },
                          label: { color: 'rgba(255, 255, 255, 0.7)' },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                            '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Brand"
                        variant="outlined"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        sx={{
                          input: { color: 'white' },
                          label: { color: 'rgba(255, 255, 255, 0.7)' },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                            '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Stock"
                        type="number"
                        variant="outlined"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        sx={{
                          input: { color: 'white' },
                          label: { color: 'rgba(255, 255, 255, 0.7)' },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                            '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                          }
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{ 
                          mt: 2,
                          bgcolor: 'primary.main',
                          '&:hover': { bgcolor: 'primary.dark' }
                        }}
                      >
                        Create Product
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductList;
