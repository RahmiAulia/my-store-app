import { Grid } from "@mui/material";
import React from "react";
import AddProduct from "../components/AddProduct";
import Header from "../components/Header";

const AddProductPage = () => {
  return (
    <Grid container direction="column">
      <Grid>
        <Header />
      </Grid>
      <Grid
        sx={{
          flexGrow: 1,
          padding: "20px",
          mt: "50px",
          alignContent: "center",
        }}
      >
        <AddProduct />
      </Grid>
    </Grid>
  );
};

export default AddProductPage;
