import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import { Button } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Link } from "react-router-dom";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);

  const toggleRowExpansion = (index) => {
    setExpandedRows(prev => {
      const isExpanded = prev.includes(index);
      return isExpanded ? prev.filter(i => i !== index) : [...prev, index];
    });
  };

  const columns = [
    {
      name: "image",
      label: "Image",
      options: {
        customBodyRender: (value) => (
          <img src={value} alt="Product" style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }} />
        ),
      },
    },
    {
      name: "name",
      label: "Product Name",
      options: {
        sort: true,
      },
    },
    {
      name: "brand",
      label: "Brand",
      options: {
        sort: true,
      },
    },
    {
      name: "price",
      label: "Price",
      options: {
        sort: true,
        customBodyRender: (value) => `$${value.toFixed(2)}`,
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta) => {
          const productId = products[tableMeta.rowIndex]._id;
          return (
            <Link to={`/admin/product/update/${productId}`}>
              <Button variant="contained" color="primary">
                Update
              </Button>
            </Link>
          );
        },
      },
    },
  ];

  const options = {
    filterType: "dropdown",
    responsive: "standard",
    expandableRows: true,
    expandableRowsHeader: false,
    expandableRowsOnClick: true,
    pagination: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 20],
    renderExpandableRow: (rowData, rowMeta) => {
      const product = products[rowMeta.dataIndex];
      return (
        <tr>
          <td colSpan={6} style={{ backgroundColor: "#f9f9f9", padding: "10px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <p><strong>Description:</strong> {product.description}</p>
              <p><strong>Quantity:</strong> {product.quantity}</p>
              <p><strong>In Stock:</strong> {product.countInStock}</p>
              <p><strong>Category:</strong> {product.category.name}</p>
              <p><strong>Camera Type:</strong> {product.category.cameraType}</p>
              <p><strong>Sensor Size:</strong> {product.category.sensorSize}</p>
              <p><strong>Primary Use Case:</strong> {product.category.primaryUseCase}</p>
            </div>
          </td>
        </tr>
      );
    },
    onRowsSelect: (rowsSelected, allRows) => {
      const selected = allRows.map((row) => products[row.dataIndex]._id);
      setSelectedProducts(selected);
    },
    customToolbarSelect: (selectedRows) => (
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleBulkDelete(selectedRows.data)}
      >
        Delete Selected
      </Button>
    ),
  };

  const handleBulkDelete = (selectedRows) => {
    const idsToDelete = selectedRows.map((row) => products[row.dataIndex]._id);
    console.log("Deleting products with IDs:", idsToDelete);
    // Implement bulk delete logic here
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading products</div>;

  return (
    <MUIDataTable
      title={`All Products (${products.length})`}
      data={products}
      columns={columns}
      options={options}
    />
  );
};

export default AllProducts;