import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import { Grid, TextField, Button, Select, MenuItem, InputLabel, FormControl, Typography } from "@mui/material";

const AdminProductUpdate = () => {
  const params = useParams();
  const { data: productData } = useGetProductByIdQuery(params._id);

  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(productData?.description || "");
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock || "");

  const navigate = useNavigate();
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      setImage(res.image);
    } catch (err) {
      toast.error("Image upload failed", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      const data = await updateProduct({ productId: params._id, formData });

      if (data?.error) {
        toast.error(data.error, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      } else {
        toast.success(`Product successfully updated`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      console.log(err);
      toast.error("Product update failed. Try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh', backgroundColor: '#121212' }}>
      <Grid item xs={12} md={8} lg={6}>
        <div className="flex flex-col md:flex-row">
          <AdminMenu />
          <div className="md:w-full p-3" style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px' }}>
            <Typography variant="h5" gutterBottom style={{ color: '#e0f7fa' }}>
              Update Product
            </Typography>

            {image && (
              <div className="text-center">
                <img
                  src={image}
                  alt="product"
                  style={{ width: '200px', height: '200px', objectFit: 'cover', margin: '0 auto', borderRadius: '8px' }}
                />
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    variant="filled"
                    style={{ backgroundColor: '#263238', color: '#e0f7fa' }}
                    InputLabelProps={{ style: { color: '#e0f7fa' } }}
                    InputProps={{ style: { color: '#e0f7fa' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    variant="filled"
                    style={{ backgroundColor: '#263238', color: '#e0f7fa' }}
                    InputLabelProps={{ style: { color: '#e0f7fa' } }}
                    InputProps={{ style: { color: '#e0f7fa' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    variant="filled"
                    style={{ backgroundColor: '#263238', color: '#e0f7fa' }}
                    InputLabelProps={{ style: { color: '#e0f7fa' } }}
                    InputProps={{ style: { color: '#e0f7fa' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    variant="filled"
                    style={{ backgroundColor: '#263238', color: '#e0f7fa' }}
                    InputLabelProps={{ style: { color: '#e0f7fa' } }}
                    InputProps={{ style: { color: '#e0f7fa' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                    variant="filled"
                    style={{ backgroundColor: '#263238', color: '#e0f7fa' }}
                    InputLabelProps={{ style: { color: '#e0f7fa' } }}
                    InputProps={{ style: { color: '#e0f7fa' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Stock"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                    variant="filled"
                    style={{ backgroundColor: '#263238', color: '#e0f7fa' }}
                    InputLabelProps={{ style: { color: '#e0f7fa' } }}
                    InputProps={{ style: { color: '#e0f7fa' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required variant="filled" style={{ backgroundColor: '#263238' }}>
                    <InputLabel style={{ color: '#e0f7fa' }}>Category</InputLabel>
                    <Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={{ color: '#e0f7fa' }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    style={{ backgroundColor: '#00796b', color: '#fff' }}
                  >
                    Upload Image
                    <input
                      type="file"
                      hidden
                      onChange={uploadFileHandler}
                    />
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ backgroundColor: '#00796b', color: '#fff' }}
                  >
                    Update Product
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default AdminProductUpdate;