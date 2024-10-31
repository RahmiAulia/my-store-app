// src/components/ProductListTable.js
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, getAllProducts, updateProduct } from "../service/productService";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  TableCell,
  Paper,
  TablePagination,
  Fab,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import NiceModal from "@ebay/nice-modal-react"; // Make sure you have NiceModal imported
import AlertModal from './AlertModal'; // Import AlertModal

const ProductListTable = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const [alertMessage, setAlertMessage] = React.useState("");
  const [isSuccess, setIsSuccess] = React.useState(false);
  
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      setAlertMessage("Product deleted successfully!"); // Set success message
      setIsSuccess(true); // Indicate success
      NiceModal.show(AlertModal, { message: "Product deleted successfully!", isSuccess: true }); // Show success alert
    },
    onError: (error) => {
      console.error("Failed to delete product:", error);
      setAlertMessage("Failed to delete product: " + error.message); // Set error message
      setIsSuccess(false); // Indicate failure
      NiceModal.show(AlertModal, { message: "Failed to delete product: " + error.message, isSuccess: false }); // Show error alert
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  const columns = React.useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "title", header: "Product" },
      { accessorKey: "category", header: "Category" },
      { accessorKey: "price", header: "Price" },
    ],
    []
  );
  
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleUpdate = (id) => {
    navigate(`/update-product/${id}`);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 440,
          overflowX: "auto",
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableCell>
                ))}
                <TableCell key="actions">Actions</TableCell>
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table
              .getRowModel()
              .rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button
                      onClick={() => handleUpdate(row.original.id)}
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      Update
                    </Button>
                    <Button
                      onClick={() => handleDelete(row.original.id)}
                      variant="contained"
                      color="secondary"
                      size="small"
                      style={{ marginLeft: "8px" }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          display: "flex",
          justifyContent: "flex-start",
        }}
      />
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => navigate("/add-product")}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>
    </Paper>
  );
};

export default ProductListTable;

//dengan custom hook
// src/hooks/useProducts.js

// import { useQuery } from '@tanstack/react-query';
// import { getProducts } from '../services/productService';

// export const useProducts = () => {
//   return useQuery(['products'], getProducts);
// };

// // src/components/ProductTable.jsx

// import React from 'react';
// import { useTable } from '@tanstack/react-table';
// import { useProducts } from '../hooks/useProducts';

// const ProductTable = () => {
//   const { data: products = [], isLoading, isError, error } = useProducts();

//   const columns = React.useMemo(
//     () => [
//       { Header: 'ID', accessor: 'id' },
//       { Header: 'Title', accessor: 'title' },
//       { Header: 'Price', accessor: 'price' },
//     ],
//     []
//   );

//   const tableInstance = useTable({ columns, data: products });
//   const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = tableInstance;

//   if (isLoading) return <p>Loading...</p>;
//   if (isError) return <p>Error: {error.message}</p>;

//   return (
//     <table {...getTableProps()} border="1" cellPadding="10" cellSpacing="0">
//       <thead>
//         {headerGroups.map(headerGroup => (
//           <tr {...headerGroup.getHeaderGroupProps()}>
//             {headerGroup.headers.map(column => (
//               <th {...column.getHeaderProps()}>{column.render('Header')}</th>
//             ))}
//           </tr>
//         ))}
//       </thead>
//       <tbody {...getTableBodyProps()}>
//         {rows.map(row => {
//           prepareRow(row);
//           return (
//             <tr {...row.getRowProps()}>
//               {row.cells.map(cell => (
//                 <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
//               ))}
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   );
// };

// export default ProductTable;
