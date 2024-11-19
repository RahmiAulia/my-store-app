import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSingleProduct, updateProduct } from "../service/productService";
import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import NiceModal from "@ebay/nice-modal-react";
import AlertModal from "./AlertModal";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });

  // Fetch product data
  const { isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getSingleProduct(id),
    onSuccess: (data) => {
      setProductData(data);
    },
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (updatedData) => updateProduct(id, updatedData),
    onSuccess: () => {
      NiceModal.show(AlertModal, {
        message: "Product updated successfully!",
        isSuccess: true,
      });
      navigate("/"); // Redirect to product list after showing success alert
    },
    onError: (error) => {
      NiceModal.show(AlertModal, {
        message: "Failed to update product: " + error.message,
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
    if (productData.price < 0) {
      NiceModal.show(AlertModal, {
        message: "Price cannot be negative!",
        isSuccess: false,
      });
      return;
    }

    if (Object.values(productData).some((field) => field.trim() === "")) {
      NiceModal.show(AlertModal, {
        message: "All fields are required and cannot contain only spaces.",
        isSuccess: false,
      });
      return;
    } 
    updateMutation.mutate(productData);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading product data.</p>;

  return (
    <Paper sx={{ padding: 4, maxWidth: 500, margin: "auto" }}>
      <Typography variant="h5" component="div" gutterBottom>
        Update Product
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
              disabled={updateMutation.isLoading}
            >
              {updateMutation.isLoading ? (
                <CircularProgress size={24} />
              ) : (
                "Update Product"
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
      {updateMutation.isError && (
        <Typography color="error">Error: {updateMutation.error.message}</Typography>
      )}
    </Paper>
  );
};

export default UpdateProduct;
