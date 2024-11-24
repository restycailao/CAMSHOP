import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  styled,
} from "@mui/material";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1A1A1A',
  borderRadius: theme.spacing(1),
}));

const StyledTableCell = styled(TableCell)({
  color: 'white',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
});

const StyledHeaderCell = styled(TableCell)({
  color: 'white',
  fontWeight: 'bold',
  borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
});

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#121212', py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ pt: 4 }}>
          <Typography variant="h4" color="white" gutterBottom align="center">
            My Orders
          </Typography>

          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="error">{error?.data?.message || error.error}</Message>
          ) : (
            <Box sx={{ mt: 4 }}>
              <StyledPaper>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledHeaderCell>ID</StyledHeaderCell>
                        <StyledHeaderCell>DATE</StyledHeaderCell>
                        <StyledHeaderCell>TOTAL</StyledHeaderCell>
                        <StyledHeaderCell>PAID</StyledHeaderCell>
                        <StyledHeaderCell>DELIVERED</StyledHeaderCell>
                        <StyledHeaderCell align="right">ACTIONS</StyledHeaderCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order._id} hover sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}>
                          <StyledTableCell>{order._id}</StyledTableCell>
                          <StyledTableCell>
                            {moment(order.createdAt).format('MM/DD/YYYY')}
                          </StyledTableCell>
                          <StyledTableCell>
                            ${order.totalPrice}
                          </StyledTableCell>
                          <StyledTableCell>
                            {order.isPaid ? (
                              moment(order.paidAt).format('MM/DD/YYYY')
                            ) : (
                              <Typography color="error.main">Not Paid</Typography>
                            )}
                          </StyledTableCell>
                          <StyledTableCell>
                            {order.isDelivered ? (
                              moment(order.deliveredAt).format('MM/DD/YYYY')
                            ) : (
                              <Typography color="error.main">Not Delivered</Typography>
                            )}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            <Link to={`/order/${order._id}`}>
                              <Button
                                variant="contained"
                                size="small"
                                sx={{
                                  bgcolor: '#ec4899',
                                  color: 'white',
                                  '&:hover': {
                                    bgcolor: '#be185d',
                                  },
                                }}
                              >
                                View Details
                              </Button>
                            </Link>
                          </StyledTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </StyledPaper>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default UserOrder;
