import React, { useEffect, useState } from "react";
import NiceModal from "@ebay/nice-modal-react";
import AlertModal from "../components/AlertModal";
import { addNewProduct } from "../service/productService";
import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddProduct = () => {
  const queryClient = useQueryClient();

  const [productData, setProductData] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });

  const [localProducts, setLocalProducts] = useState([]);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setLocalProducts(storedProducts);
  }, []);

  const mutation = useMutation({
    mutationFn: addNewProduct,
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries(["products"]);
      setProductData({
        title: "",
        price: "",
        description: "",
        image: "",
        category: "",
      });

      const updatedProducts = [...localProducts, newProduct];
      setLocalProducts(updatedProducts);
      localStorage.setItem("products", JSON.stringify(updatedProducts));

      // Memunculkan modal sukses
      NiceModal.show(AlertModal, {
        message: "Product added successfully!",
        isSuccess: true,
      });
    },
    onError: (error) => {
      // Memunculkan modal error
      NiceModal.show(AlertModal, {
        message: `Failed to add product: ${error.message}`,
        isSuccess: false,
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(productData);
  };

  return (
    <Paper sx={{ padding: 4, maxWidth: 700, margin: "auto" }}>
      <Typography variant="h5" component="div" gutterBottom>
        Add a New Product
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Product Title"
              name="title"
              value={productData.title}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Price"
              name="price"
              value={productData.price}
              onChange={handleChange}
              type="number"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={productData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Image Link"
              name="image"
              value={productData.image}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Category"
              name="category"
              value={productData.category}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? (
                <CircularProgress size={24} />
              ) : (
                "Add Product"
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AddProduct;