// src/App.js

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductListPage from "./pages/ProductListPage";
import AddProductPage from "./pages/AddProductPage";
import UpdateProductPage from "./pages/UpdateProductPage";
import NiceModal from "@ebay/nice-modal-react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <NiceModal.Provider>
    <Router>
      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/update-product/:id" element={<UpdateProductPage />} />
      </Routes>
    </Router>
    </NiceModal.Provider>
  </QueryClientProvider>
);

export default App;

