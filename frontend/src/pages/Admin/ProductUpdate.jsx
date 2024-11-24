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
import { Grid, TextField, Button, Select, MenuItem, InputLabel, FormControl, Typography, Box } from "@mui/material";

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
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category?._id);
      setQuantity(product.quantity);
      setBrand(product.brand);
      setStock(product.countInStock);
      setImage(product.image);
    }
  }, [product]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const result = await uploadProductImage(formData).unwrap();
      if (result && result.image) {
        setImage(result.image);
        toast.success("Image uploaded successfully");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('quantity', quantity);
      formData.append('brand', brand);
      formData.append('countInStock', stock);
      formData.append('image', image);

      const result = await updateProduct({ 
        productId: params._id, 
        updatedProduct: formData 
      }).unwrap();

      toast.success(`${result.name} updated successfully`);
      navigate("/admin/allproductslist");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.data?.message || error?.data?.error || "Failed to update product");
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
                    {image ? (
                      <Box sx={{ mb: 4, width: '100%', textAlign: 'center' }}>
                        <img
                          src={image}
                          alt="product"
                          style={{ 
                            width: '100%', 
                            maxWidth: '400px',
                            height: 'auto', 
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                      </Box>
                    ) : (
                      <Box sx={{ 
                        width: '100%', 
                        height: '300px',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 4
                      }}>
                        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          No image uploaded
                        </Typography>
                      </Box>
                    )}
                    
                    <Button
                      variant="contained"
                      component="label"
                      sx={{ 
                        width: '100%',
                        bgcolor: 'primary.main',
                        '&:hover': { bgcolor: 'primary.dark' }
                      }}
                    >
                      Upload Image
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={uploadFileHandler}
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