import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";
import { FaDollarSign, FaUsers, FaShoppingBag } from 'react-icons/fa';
import { Box, Container, Grid, Paper, Typography, IconButton, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1A1A1A',
  padding: theme.spacing(3),
  borderRadius: 12,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 0 20px rgba(236, 72, 153, 0.2)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(236, 72, 153, 0.1)',
  borderRadius: 8,
  padding: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const GrowthIndicator = styled(Typography)(({ growth }) => ({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: growth >= 0 ? '#10B981' : '#EF4444',
}));

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail, isLoading: loadingSales } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "bar",
        background: '#1A1A1A',
        foreColor: '#fff',
        toolbar: {
          show: true,
          tools: {
            download: false
          }
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '60%',
          dataLabels: {
            position: 'top'
          }
        }
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: (value) => `$${value.toFixed(2)}`
        }
      },
      colors: ["#ec4899"],
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#fff'],
          fontSize: '12px'
        },
        formatter: (value) => `$${value.toFixed(0)}`,
        offsetY: -20
      },
      title: {
        text: "Daily Sales",
        align: "left",
        style: {
          color: '#fff',
          fontSize: '18px'
        }
      },
      grid: {
        borderColor: "#333",
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
          style: {
            color: '#fff'
          }
        },
        labels: {
          style: {
            colors: '#fff'
          },
          formatter: (value) => {
            const date = new Date(value);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }
        }
      },
      yaxis: {
        title: {
          text: "Sales ($)",
          style: {
            color: '#fff'
          }
        },
        min: 0,
        labels: {
          style: {
            colors: '#fff'
          },
          formatter: (value) => `$${value.toFixed(0)}`
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
        labels: {
          colors: '#fff'
        }
      },
    },
    series: [{ name: "Daily Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail && !loadingSales) {
      const sortedSales = [...salesDetail].sort((a, b) => new Date(a._id) - new Date(b._id));
      
      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: sortedSales.map(item => item._id),
          },
        },
        series: [
          { 
            name: "Daily Sales",
            data: sortedSales.map(item => parseFloat(item.totalSales.toFixed(2)))
          },
        ],
      }));
    }
  }, [salesDetail, loadingSales]);

  const calculateGrowth = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const previousSales = sales?.totalSales ? sales.totalSales * 0.9 : 0;
  const previousCustomers = customers?.length ? customers.length * 0.95 : 0;
  const previousOrders = orders?.totalOrders ? orders.totalOrders * 0.92 : 0;

  const salesGrowth = calculateGrowth(sales?.totalSales || 0, previousSales);
  const customersGrowth = calculateGrowth(customers?.length || 0, previousCustomers);
  const ordersGrowth = calculateGrowth(orders?.totalOrders || 0, previousOrders);

  const StatCard = ({ icon: Icon, title, value, growth, isLoading }) => (
    <StyledPaper elevation={0}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <IconWrapper>
          <Icon style={{ fontSize: 24, color: '#ec4899' }} />
        </IconWrapper>
        <GrowthIndicator growth={growth}>
          {growth >= 0 ? '+' : ''}{growth}%
        </GrowthIndicator>
      </Box>
      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>
        {isLoading ? <CircularProgress size={24} /> : value}
      </Typography>
    </StyledPaper>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0E0E0E', pt: 9, color: '#fff' }}>
      <AdminMenu />
      
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <StatCard
              icon={FaDollarSign}
              title="Total Sales"
              value={`$${sales?.totalSales?.toFixed(2)}`}
              growth={salesGrowth}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              icon={FaUsers}
              title="Total Customers"
              value={customers?.length}
              growth={customersGrowth}
              isLoading={loading}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              icon={FaShoppingBag}
              title="Total Orders"
              value={orders?.totalOrders}
              growth={ordersGrowth}
              isLoading={loadingTwo}
            />
          </Grid>

          <Grid item xs={12}>
            <StyledPaper elevation={0}>
              {loadingSales ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
                  <CircularProgress sx={{ color: '#fff' }} />
                </Box>
              ) : (
                <Chart
                  options={state.options}
                  series={state.series}
                  type="bar"
                  width="100%"
                  height={350}
                />
              )}
            </StyledPaper>
          </Grid>

          <Grid item xs={12}>
            <StyledPaper elevation={0} sx={{ color: '#fff' }}>
              <OrderList />
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
