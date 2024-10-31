import { Grid } from "@mui/material";
import React from "react";
import Header from "../components/Header";
import UpdateProduct from "../components/UpdateProduct";

const UpdateProductPage = () => {
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
        <UpdateProduct />
      </Grid>
    </Grid>
  );
};

export default UpdateProductPage;
