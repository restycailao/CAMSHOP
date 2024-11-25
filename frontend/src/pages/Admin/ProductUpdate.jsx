import React, { useEffect, useState } from "react";
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
import { Grid, Button, Select, MenuItem, Typography, Box, IconButton } from "@mui/material";
import { TextField } from "formik-mui";
import Delete from "@mui/icons-material/Delete";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const AdminProductUpdate = () => {
  const params = useParams();
  const { data: product } = useGetProductByIdQuery(params._id);
  const [updateProduct] = useUpdateProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();
  const { data: categories } = useFetchCategoriesQuery();
  const navigate = useNavigate();

  const [images, setImages] = useState(product?.images || []);

  useEffect(() => {
    if (product) {
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
          throw new Error(res.error.message || "Upload failed");
        }
        return res.image;
      } catch (err) {
        console.error("Upload error:", err);
        toast.error(err?.data?.message || err.message || "Failed to upload image");
        return null;
      }
    });

    try {
      const uploadedImages = await Promise.all(uploadPromises);
      const validImages = uploadedImages.filter((img) => img !== null);
      if (validImages.length > 0) {
        setImages((prev) => [...prev, ...validImages]);
        toast.success("Images uploaded successfully");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload some images");
    }
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // Formik initial values and validation schema
  const initialValues = {
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category: product?.category?._id || "",
    quantity: product?.quantity || "",
    brand: product?.brand || "",
    stock: product?.countInStock || 0,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number().required("Price is required").positive("Must be positive"),
    category: Yup.string().required("Category is required"),
    quantity: Yup.number().required("Quantity is required").min(1, "At least 1"),
    brand: Yup.string().required("Brand is required"),
    stock: Yup.number().required("Stock is required").min(0, "Cannot be negative"),
  });

  const handleSubmit = async (values) => {
    try {
      const productData = { ...values, images };
      const { data } = await updateProduct({
        productId: params.id,
        updatedProduct: productData,
      }).unwrap();

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Product updated");
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      console.error(err);
      toast.error("Product update failed. Try again");
    }
  };

  return (
    <Box sx={{ backgroundColor: "#121212", minHeight: "100vh", color: "white" }}>
      <Grid container>
        <Grid item xs={12} md={2}>
          <AdminMenu />
        </Grid>

        <Grid item xs={12} md={10}>
          <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: "white" }}>
              Update Product
            </Typography>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, values, handleChange }) => (
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
                              <Typography variant="h6" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
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
                            label="Name"
                            fullWidth
                            variant="outlined"
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
                            variant="outlined"
                            multiline
                            rows={4}
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
                            variant="outlined"
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
                            name="category"
                            label="Category"
                            select
                            fullWidth
                            variant="outlined"
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
                            {categories?.map((cat) => (
                              <MenuItem key={cat._id} value={cat._id} sx={{ color: "black" }}>
                                {cat.name}
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
                            variant="outlined"
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
                            variant="outlined"
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
                            name="stock"
                            label="Stock"
                            type="number"
                            fullWidth
                            variant="outlined"
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
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      mt: 4,
                      bgcolor: "primary.main",
                      "&:hover": { bgcolor: "primary.dark" },
                      width: "100%",
                    }}
                    disabled={isSubmitting}
                  >
                    Update Product
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminProductUpdate;
