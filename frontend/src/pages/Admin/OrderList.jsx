import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Chip,
  styled,
} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: '#fff',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '16px',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  '& td': {
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
}));

const StatusChip = styled(Chip)(({ status }) => ({
  backgroundColor: status ? '#10B981' : '#EF4444',
  color: '#fff',
  width: '100px',
  '& .MuiChip-label': {
    fontWeight: 500,
  },
}));

const ViewButton = styled(Button)({
  backgroundColor: '#ec4899',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#be185d',
  },
});

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0E0E0E' }}>
      <AdminMenu />
      <Box sx={{ flexGrow: 1, pt: 11, px: 3 }}>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Paper 
            elevation={0}
            sx={{ 
              bgcolor: '#151515',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>ITEMS</StyledTableCell>
                    <StyledTableCell>ID</StyledTableCell>
                    <StyledTableCell>USER</StyledTableCell>
                    <StyledTableCell>DATE</StyledTableCell>
                    <StyledTableCell>TOTAL</StyledTableCell>
                    <StyledTableCell>PAID</StyledTableCell>
                    <StyledTableCell>DELIVERED</StyledTableCell>
                    <StyledTableCell>ACTIONS</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {orders.map((order) => (
                    <StyledTableRow key={order._id}>
                      <StyledTableCell>
                        <Box
                          component="img"
                          src={order.orderItems[0]?.image}
                          alt={order._id}
                          sx={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                          {order._id}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography>
                          {order.user ? order.user.username : "N/A"}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography sx={{ fontWeight: 600 }}>
                          $ {order.totalPrice}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <StatusChip 
                          label={order.isPaid ? "Completed" : "Pending"}
                          status={order.isPaid}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <StatusChip 
                          label={order.isDelivered ? "Completed" : "Pending"}
                          status={order.isDelivered}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Link to={`/order/${order._id}`} style={{ textDecoration: 'none' }}>
                          <ViewButton variant="contained" size="small">
                            View Details
                          </ViewButton>
                        </Link>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default OrderList;
