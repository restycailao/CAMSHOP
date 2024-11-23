import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import {
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Box,
} from "@mui/material";

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

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully");
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error("Image upload failed. Try Again");
    }
  };

  return (
    <Box sx={{ backgroundColor: colorPalette.background.main, minHeight: '100vh' }}>
      <Grid container sx={{ minHeight: '100vh' }}>
        <Grid item xs={12} md={2} sx={{ 
          backgroundColor: colorPalette.background.paper,
          borderRight: `1px solid ${colorPalette.accent}`,
        }}>
          <AdminMenu />
        </Grid>

        <Grid item xs={12} md={10}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              height: '100%',
              p: 4,
              pt: '90px', 
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: colorPalette.text.primary,
                mb: 3,
                textAlign: "center",
                fontWeight: "bold"
              }}
            >
              Create Product
            </Typography>

            {imageUrl && (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <img
                  src={imageUrl}
                  alt="product"
                  style={{ maxWidth: '200px', height: 'auto' }}
                />
              </Box>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  sx={{
                    backgroundColor: colorPalette.primary,
                    '&:hover': {
                      backgroundColor: colorPalette.secondary
                    }
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
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: colorPalette.accent,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: colorPalette.text.secondary,
                    },
                    '& .MuiOutlinedInput-input': {
                      color: colorPalette.text.primary,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: colorPalette.accent,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: colorPalette.text.secondary,
                    },
                    '& .MuiOutlinedInput-input': {
                      color: colorPalette.text.primary,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: colorPalette.accent,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: colorPalette.text.secondary,
                    },
                    '& .MuiOutlinedInput-input': {
                      color: colorPalette.text.primary,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: colorPalette.text.secondary }}>
                    Category
                  </InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    sx={{
                      color: colorPalette.text.primary,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: colorPalette.accent,
                      },
                    }}
                  >
                    {categories?.map((c) => (
                      <MenuItem key={c._id} value={c._id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: colorPalette.accent,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: colorPalette.text.secondary,
                    },
                    '& .MuiOutlinedInput-input': {
                      color: colorPalette.text.primary,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: colorPalette.accent,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: colorPalette.text.secondary,
                    },
                    '& .MuiOutlinedInput-input': {
                      color: colorPalette.text.primary,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: colorPalette.accent,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: colorPalette.text.secondary,
                    },
                    '& .MuiOutlinedInput-input': {
                      color: colorPalette.text.primary,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: colorPalette.primary,
                    color: colorPalette.text.primary,
                    padding: '12px',
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: colorPalette.secondary,
                    },
                  }}
                >
                  Create Product
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductList;
