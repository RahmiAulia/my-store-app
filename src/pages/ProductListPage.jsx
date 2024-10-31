import React from "react";
import Header from "../components/Header";
import ProductListTable from "../components/ProductList";
import { Grid } from "@mui/material";

const ProductListPage = () => {
  return (
    <Grid container direction="column" >
      <Grid>
        <Header/>
      </Grid>

      <Grid
        sx={{
          flexGrow: 1,
          padding: "20px",
          mt: "50px",
          alignContent: "center",
        }}
      >
        <ProductListTable />
      </Grid>
    </Grid>

    
  );
};

export default ProductListPage;
