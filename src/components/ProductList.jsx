import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../service/productService";
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
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import NiceModal from "@ebay/nice-modal-react";
import AlertModal from "./AlertModal";

const ProductListTable = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      NiceModal.show(AlertModal, {
        message: "Product deleted successfully!",
        isSuccess: true,
      });
    },
    onError: (error) => {
      NiceModal.show(AlertModal, {
        message: "Failed to delete product: " + error.message,
        isSuccess: false,
      });
    },
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

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleUpdate = (id) => {
    navigate(`/update-product/${id}`);
  };

  const handleDownloadExcel = React.useCallback(() => {
    const visibleData = table
      .getRowModel()
      .rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((row) => {
        const rowData = {};
        row.getVisibleCells().forEach((cell) => {
          const header = cell.column.columnDef.header;
          rowData[header] = cell.getValue();
        });
        return rowData;
      });

    const worksheet = XLSX.utils.json_to_sheet(visibleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "products_filtered.xlsx");
  }, [page, rowsPerPage, table]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}>
        <Button
          variant="contained"
          color="success"
          size="small"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadExcel}
        >
          Download
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ maxHeight: 440, overflowX: "auto" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
                <TableCell key="actions">Actions</TableCell>
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                      sx={{ ml: 1 }}
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
