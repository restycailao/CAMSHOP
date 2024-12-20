import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import { useAllProductsQuery, useDeleteProductMutation } from "../../redux/api/productApiSlice";
import { Button, Box } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Link } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import { toast } from "react-toastify";
import hotToast from 'react-hot-toast';

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
    
    if (idsToDelete.length === 0) {
      toast.error("Please select products to delete");
      return;
    }

    toast.info(
      <div>
        <p>Are you sure you want to delete {idsToDelete.length} selected products?</p>
        <div className="mt-2 flex justify-end space-x-2">
          <button
            onClick={() => {
              const deletePromise = async () => {
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

                if (failCount > 0) {
                  throw new Error(`Failed to delete ${failCount} products`);
                }

                return `Successfully deleted ${successCount} products`;
              };

              hotToast.promise(
                deletePromise(),
                {
                  loading: 'Deleting products...',
                  success: (message) => message,
                  error: (err) => err.message,
                },
                {
                  style: {
                    minWidth: '250px',
                  },
                  success: {
                    duration: 5000,
                    style: {
                      background: '#2e7d32',
                      color: 'white',
                    },
                  },
                  error: {
                    style: {
                      background: '#d32f2f',
                      color: 'white',
                    },
                  },
                  loading: {
                    style: {
                      background: '#333',
                      color: 'white',
                    },
                  },
                }
              );

              setExpandedRows([]); // Close all expanded rows
              refetch(); // Refetch products list
              toast.dismiss();
            }}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Delete All
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const handleDelete = async (productId) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this product?</p>
        <div className="mt-2 flex justify-end space-x-2">
          <button
            onClick={() => {
              deleteProduct(productId)
                .unwrap()
                .then(() => {
                  toast.success("Product deleted successfully");
                  setExpandedRows([]); // Close all expanded rows
                  refetch(); // Refetch products list
                })
                .catch((err) => {
                  toast.error(err?.data?.message || err.error || "Error deleting product");
                });
              toast.dismiss();
            }}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        draggable: false,
      }
    );
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