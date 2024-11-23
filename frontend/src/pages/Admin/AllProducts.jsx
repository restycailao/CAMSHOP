import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import { useAllProductsQuery, useDeleteProductMutation } from "../../redux/api/productApiSlice";
import { Button, Box } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Link } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import { toast } from "react-toastify";

const AllProducts = () => {
  const { data: products, isLoading, isError, refetch } = useAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);

  const toggleRowExpansion = (index) => {
    setExpandedRows(prev => {
      const isExpanded = prev.includes(index);
      return isExpanded ? prev.filter(i => i !== index) : [...prev, index];
    });
  };

  const handleBulkDelete = async (selectedRows) => {
    const idsToDelete = selectedRows.map((row) => products[row.dataIndex]._id);
    
    if (!window.confirm(`Are you sure you want to delete ${idsToDelete.length} products?`)) {
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const productId of idsToDelete) {
      try {
        const { data } = await deleteProduct(productId);
        if (data) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (err) {
        console.error(`Failed to delete product ${productId}:`, err);
        failCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully deleted ${successCount} products`);
    }
    if (failCount > 0) {
      toast.error(`Failed to delete ${failCount} products`);
    }

    setExpandedRows([]); // Close all expanded rows
    refetch(); // Refetch products list
  };

  const handleDelete = async (productId) => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      const { data } = await deleteProduct(productId);
      if (data) {
        toast.success(`"${data.name}" is deleted`);
        setExpandedRows([]); // Close all expanded rows
        refetch(); // Refetch products list
      }
    } catch (err) {
      console.log(err);
      toast.error("Delete failed. Try again.");
    }
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
            <div>
              <Link to={`/admin/product/update/${productId}`}>
                <Button variant="contained" color="primary">
                  Update
                </Button>
              </Link>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDelete(productId)}
                style={{ marginLeft: '10px' }}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    },
  ];

  const options = {
    filterType: "dropdown",
    responsive: "standard",
    selectableRows: 'multiple',
    expandableRows: true,
    expandableRowsHeader: false,
    expandableRowsOnClick: true,
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
    pagination: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 20],
    renderExpandableRow: (rowData, rowMeta) => {
      const product = products[rowMeta.dataIndex];
      return (
        <tr>
          <td colSpan={6} style={{ padding: "10px" }}>
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
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading products</div>;

  return (
    <div className="flex bg-[#0E0E0E] min-h-screen">
      <AdminMenu />
      <div className="flex-1 pt-[90px] px-4">
        <div className="mb-4">
          <Link to="/admin/productlist">
            <Button variant="contained" color="primary">
              Create Product
            </Button>
          </Link>
        </div>

        <MUIDataTable
          title={`All Products (${products.length})`}
          data={products}
          columns={columns}
          options={options}
        />
      </div>
    </div>
  );
};

export default AllProducts;