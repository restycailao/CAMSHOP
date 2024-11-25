import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import {
  Box,
  Button,
  Grid,
  Typography,
  MenuItem,
  IconButton,
  TextField as MuiTextField,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { TextField } from "formik-mui";

const ProductList = () => {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const [createProduct] = useCreateProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();
  const { data: categories } = useFetchCategoriesQuery();

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required("Product name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be positive"),
    category: Yup.string().required("Category is required"),
    quantity: Yup.number()
      .required("Quantity is required")
      .min(1, "Quantity must be at least 1"),
    brand: Yup.string().required("Brand is required"),
    stock: Yup.number()
      .required("Stock count is required")
      .min(0, "Stock cannot be negative"),
  });

  // File upload handler
  const uploadFileHandler = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("image", file);
    });

    try {
      const res = await uploadProductImage(formData).unwrap();
      const newImages = Array.isArray(res.images) ? res.images : [res.image];
      setImages((prev) => [...prev, ...newImages]);
      toast.success("Images uploaded successfully");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err?.data?.message || "Failed to upload images");
    }
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Box sx={{ backgroundColor: "#121212", minHeight: "100vh", color: "white" }}>
      <Grid container>
        <Grid item xs={12} md={2}>
          <AdminMenu />
        </Grid>

        <Grid item xs={12} md={10}>
          <Box
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "1200px",
              margin: "0 auto",
              minHeight: "100vh",
            }}
          >
            <Typography
              variant="h4"
              sx={{ color: "white", mb: 4, textAlign: "center" }}
            >
              Create Product
            </Typography>

            <Formik
              initialValues={{
                name: "",
                description: "",
                price: "",
                category: "",
                quantity: "",
                brand: "",
                stock: 0,
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { resetForm }) => {
                try {
                  const productData = {
                    ...values,
                    price: Number(values.price),
                    quantity: Number(values.quantity),
                    countInStock: Number(values.stock),
                    images,
                  };

                  const result = await createProduct(productData).unwrap();
                  toast.success(`${result.name} is created`);
                  resetForm();
                  navigate("/admin/allproductslist");
                } catch (err) {
                  console.error("Product creation error:", err);
                  toast.error(
                    err?.data?.message || "Product creation failed. Try again"
                  );
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Grid container spacing={4}>
                    {/* Image Upload Section */}
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          bgcolor: "rgba(255, 255, 255, 0.05)",
                          p: 4,
                          borderRadius: 2,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                            gap: 2,
                            mb: 4,
                          }}
                        >
                          {images.length > 0 ? (
                            images.map((image, index) => (
                              <Box
                                key={index}
                                sx={{
                                  position: "relative",
                                  width: "100%",
                                  paddingTop: "100%",
                                  borderRadius: "8px",
                                  overflow: "hidden",
                                }}
                              >
                                <img
                                  src={image}
                                  alt={`product-${index}`}
                                  style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                                <IconButton
                                  onClick={() => removeImage(index)}
                                  sx={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    bgcolor: "rgba(0, 0, 0, 0.5)",
                                    "&:hover": {
                                      bgcolor: "rgba(0, 0, 0, 0.7)",
                                    },
                                  }}
                                  size="small"
                                >
                                  <Delete sx={{ color: "white", fontSize: 20 }} />
                                </IconButton>
                              </Box>
                            ))
                          ) : (
                            <Box
                              sx={{
                                width: "100%",
                                height: "300px",
                                bgcolor: "rgba(255, 255, 255, 0.1)",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gridColumn: "1 / -1",
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{ color: "rgba(255, 255, 255, 0.5)" }}
                              >
                                No images uploaded
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        <Button
                          variant="contained"
                          component="label"
                          sx={{
                            width: "100%",
                            bgcolor: "primary.main",
                            "&:hover": { bgcolor: "primary.dark" },
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
                          <Field
                            component={TextField}
                            name="name"
                            label="Product Name"
                            fullWidth
                            required
                            sx={{
                              "& .MuiInputBase-input": { color: "white" },
                              "& .MuiInputLabel-root": { color: "white" },
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "white" },
                                "&:hover fieldset": { borderColor: "white" },
                                "&.Mui-focused fieldset": { borderColor: "white" },
                              },
                            }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Field
                            component={TextField}
                            name="description"
                            label="Description"
                            fullWidth
                            multiline
                            rows={4}
                            required
                            sx={{
                              "& .MuiInputBase-input": { color: "white" },
                              "& .MuiInputLabel-root": { color: "white" },
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "white" },
                                "&:hover fieldset": { borderColor: "white" },
                                "&.Mui-focused fieldset": { borderColor: "white" },
                              },
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field
                            component={TextField}
                            name="price"
                            label="Price"
                            type="number"
                            fullWidth
                            required
                            sx={{
                              "& .MuiInputBase-input": { color: "white" },
                              "& .MuiInputLabel-root": { color: "white" },
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "white" },
                                "&:hover fieldset": { borderColor: "white" },
                                "&.Mui-focused fieldset": { borderColor: "white" },
                              },
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field
                            component={TextField}
                            select
                            name="category"
                            label="Category"
                            fullWidth
                            required
                            sx={{
                              "& .MuiInputBase-input": { color: "white" },
                              "& .MuiInputLabel-root": { color: "white" },
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "white" },
                                "&:hover fieldset": { borderColor: "white" },
                                "&.Mui-focused fieldset": { borderColor: "white" },
                              },
                              "& .MuiSelect-icon": { color: "white" },
                            }}
                          >
                            {categories?.map((category) => (
                              <MenuItem
                                key={category._id}
                                value={category._id}
                                sx={{ color: "black" }}
                              >
                                {category.name}
                              </MenuItem>
                            ))}
                          </Field>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field
                            component={TextField}
                            name="quantity"
                            label="Quantity"
                            type="number"
                            fullWidth
                            required
                            sx={{
                              "& .MuiInputBase-input": { color: "white" },
                              "& .MuiInputLabel-root": { color: "white" },
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "white" },
                                "&:hover fieldset": { borderColor: "white" },
                                "&.Mui-focused fieldset": { borderColor: "white" },
                              },
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Field
                            component={TextField}
                            name="brand"
                            label="Brand"
                            fullWidth
                            required
                            sx={{
                              "& .MuiInputBase-input": { color: "white" },
                              "& .MuiInputLabel-root": { color: "white" },
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "white" },
                                "&:hover fieldset": { borderColor: "white" },
                                "&.Mui-focused fieldset": { borderColor: "white" },
                              },
                            }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Field
                            component={TextField}
                            name="stock"
                            label="Stock"
                            type="number"
                            fullWidth
                            required
                            sx={{
                              "& .MuiInputBase-input": { color: "white" },
                              "& .MuiInputLabel-root": { color: "white" },
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "white" },
                                "&:hover fieldset": { borderColor: "white" },
                                "&.Mui-focused fieldset": { borderColor: "white" },
                              },
                            }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={isSubmitting}
                            sx={{
                              mt: 2,
                              bgcolor: "primary.main",
                              "&:hover": { bgcolor: "primary.dark" },
                            }}
                          >
                            {isSubmitting ? "Creating..." : "Create Product"}
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductList;
