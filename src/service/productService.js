import api from "../api/api";

//get all data products
export const getAllProducts = async () => {
  try {
    const response = await api.get(`/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all data products : ", error);
    throw error;
  }
};

//get single product
export const getSingleProduct = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data product by ID: ", error);
    throw error;
  }
};

//post new product
export const addNewProduct = async (productData) => {
  try {
    const response = await api.post(`/products`, productData);
    return response.data;
  } catch (error) {
    console.error("Error creating data product : ", error);
    throw error;
  }
};

//put product
export const updateProduct = async (id, updateData) => {
  try {
    const response = await api.put(`/products/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating data product : ", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting data product : ", error);
    throw error;
  }
};
