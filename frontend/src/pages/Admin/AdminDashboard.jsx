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
      // Sort the sales data by date
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

  // Calculate growth percentages
  const calculateGrowth = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  // Get previous period values (simplified example)
  const previousSales = sales?.totalSales ? sales.totalSales * 0.9 : 0; // Assuming 90% of current as previous
  const previousCustomers = customers?.length ? customers.length * 0.95 : 0;
  const previousOrders = orders?.totalOrders ? orders.totalOrders * 0.92 : 0;

  const salesGrowth = calculateGrowth(sales?.totalSales || 0, previousSales);
  const customersGrowth = calculateGrowth(customers?.length || 0, previousCustomers);
  const ordersGrowth = calculateGrowth(orders?.totalOrders || 0, previousOrders);

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-[70px]">
      <AdminMenu />
      
      <div className="max-w-[1600px] mx-auto p-6">
        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Sales Card */}
          <div className="bg-[#1A1A1A] rounded-xl p-6 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-pink-500/10 p-3 rounded-lg">
                <FaDollarSign className="text-2xl text-pink-500" />
              </div>
              <span className={`text-sm font-medium ${salesGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {salesGrowth >= 0 ? '+' : ''}{salesGrowth}%
              </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Total Sales</h3>
            <p className="text-white text-2xl font-bold mt-1">
              {isLoading ? <Loader /> : `$${sales?.totalSales?.toFixed(2)}`}
            </p>
          </div>

          {/* Customers Card */}
          <div className="bg-[#1A1A1A] rounded-xl p-6 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-pink-500/10 p-3 rounded-lg">
                <FaUsers className="text-2xl text-pink-500" />
              </div>
              <span className={`text-sm font-medium ${customersGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {customersGrowth >= 0 ? '+' : ''}{customersGrowth}%
              </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Total Customers</h3>
            <p className="text-white text-2xl font-bold mt-1">
              {loading ? <Loader /> : customers?.length}
            </p>
          </div>

          {/* Orders Card */}
          <div className="bg-[#1A1A1A] rounded-xl p-6 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-pink-500/10 p-3 rounded-lg">
                <FaShoppingBag className="text-2xl text-pink-500" />
              </div>
              <span className={`text-sm font-medium ${ordersGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {ordersGrowth >= 0 ? '+' : ''}{ordersGrowth}%
              </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Total Orders</h3>
            <p className="text-white text-2xl font-bold mt-1">
              {loadingTwo ? <Loader /> : orders?.totalOrders}
            </p>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
          <div className="lg:col-span-2 bg-[#1A1A1A] rounded-xl p-6 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300">
            {loadingSales ? (
              <div className="flex items-center justify-center h-[350px]">
                <Loader />
              </div>
            ) : (
              <Chart
                options={state.options}
                series={state.series}
                type="bar"
                width="100%"
                height={350}
              />
            )}
          </div>
          
          {/* Recent Activity */}
          <div className="bg-[#1A1A1A] rounded-xl p-6 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300">
            <h3 className="text-white text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                  <p className="text-gray-400">New order received</p>
                  <span className="text-gray-500 text-xs ml-auto">2m ago</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-[#1A1A1A] rounded-xl p-6 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300">
          <OrderList />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
