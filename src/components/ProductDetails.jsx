import React from "react";
import { getCoreRowModel } from "@tanstack/react-table";
import { getSingleProduct } from "../service/productService";

const ProductDetail = ({productId}) => {
    const {data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["detailProduct"],
    queryFn: getSingleProduct,
  });

  const columns = React.useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "title", header: "Product" },
      { accessorKey: "category", header: "Category" },
      { accessorKey: "price", header: "Price" },
      {accessorKey: "description", header:"Description"}
    ],
    []
  );

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;
  
  return (
    <></>
  )
}

export default ProductDetail;