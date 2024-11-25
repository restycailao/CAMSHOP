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
    <Box className="flex min-h-screen bg-[#0E0E0E]">
      <AdminMenu />
      <Container maxWidth="xl" sx={{ pt: 12, pb: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, color: 'white' }}>
          Orders ({orders?.length})
        </Typography>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="error">{error?.data?.message || error.error}</Message>
        ) : (
          <TableContainer component={Paper} sx={{ backgroundColor: '#1a1a1a', borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>ORDER ID</StyledTableCell>
                  <StyledTableCell>USER</StyledTableCell>
                  <StyledTableCell>DATE</StyledTableCell>
                  <StyledTableCell>TOTAL</StyledTableCell>
                  <StyledTableCell>PAID</StyledTableCell>
                  <StyledTableCell>DELIVERED</StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {orders?.map((order) => (
                  <StyledTableRow key={order._id}>
                    <StyledTableCell>{order._id}</StyledTableCell>
                    <StyledTableCell>
                      {order.user ? order.user.name : "N/A"}
                    </StyledTableCell>
                    <StyledTableCell>
                      {order.createdAt.substring(0, 10)}
                    </StyledTableCell>
                    <StyledTableCell>${order.totalPrice}</StyledTableCell>
                    <StyledTableCell>
                      <StatusChip
                        status={order.isPaid}
                        label={order.isPaid ? "Paid" : "Not Paid"}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <StatusChip
                        status={order.isDelivered}
                        label={order.isDelivered ? "Delivered" : "Not Delivered"}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <ViewButton
                        component={Link}
                        to={`/order/${order._id}`}
                        variant="contained"
                      >
                        View Details
                      </ViewButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
};

export default OrderList;
