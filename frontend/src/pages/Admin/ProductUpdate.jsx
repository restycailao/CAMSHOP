import React, { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductImageMutation,
  useUploadProductImageMutation,
  useGetProductByIdQuery,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import { Grid, TextField, Button, Select, MenuItem, InputLabel, FormControl, Typography, Box, IconButton } from "@mui/material";
import Delete from '@mui/icons-material/Delete';

const AdminProductUpdate = () => {
  const params = useParams();
  const { data: product } = useGetProductByIdQuery(params._id);
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProductImage] = useDeleteProductImageMutation();
  const [uploadProductImage] = useUploadProductImageMutation();
  const { data: categories } = useFetchCategoriesQuery();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState(product?.images || []);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category?._id);
      setQuantity(product.quantity);
      setBrand(product.brand);
      setStock(product.countInStock);
      setImages(product.images || []);
    }
  }, [product]);

  const uploadFileHandler = async (e) => {
    const files = Array.from(e.target.files);
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await uploadProductImage(formData).unwrap();
        if (res.error) {
          throw new Error(res.error.message || 'Upload failed');
        }
        return res.image;
      } catch (err) {
        console.error('Upload error:', err);
        if (err.name === 'TimeoutError') {
          toast.error('Upload timed out. Please try with a smaller image or check your connection.');
        } else {
          toast.error(err?.data?.message || err.message || 'Failed to upload image');
        }
        return null;
      }
    });

    try {
      const uploadedImages = await Promise.all(uploadPromises);
      const validImages = uploadedImages.filter(img => img !== null);
      if (validImages.length > 0) {
        setImages(prev => [...prev, ...validImages]);
        toast.success('Images uploaded successfully');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Failed to upload some images');
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = {
        name,
        description,
        price,
        category,
        quantity,
        brand,
        countInStock: stock,
        images: images
      };

      const { data } = await updateProduct({
        productId: params.id,
        updatedProduct: productData,
      }).unwrap();

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(`Product updated`);
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      console.error(err);
      toast.error("Product update failed. Try again");
    }
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
              Update Product
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
                        Update Product
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

export default AdminProductUpdate;