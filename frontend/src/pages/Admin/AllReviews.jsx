import { useGetAllReviewsQuery, useDeleteReviewMutation } from "../../redux/api/reviewApiSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { FaTrash, FaStar } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import AdminMenu from "./AdminMenu";
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  styled,
} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: '#fff',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  '& td': {
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
}));

const ProductLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  color: '#fff',
  textDecoration: 'none',
  '&:hover': {
    color: '#ec4899',
  },
}));

const AllReviews = () => {
  const { data: reviews, isLoading, error, refetch } = useGetAllReviewsQuery();
  const [deleteReview] = useDeleteReviewMutation();

  const handleDeleteReview = async (productId, reviewId) => {
    try {
      await deleteReview({ productId, reviewId }).unwrap();
      toast.success("Review deleted successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Error deleting review");
    }
  };

  return (
    <>
      <AdminMenu />
      <Box sx={{ 
        flexGrow: 1, 
        p: 3,
        mt: 8,
        backgroundColor: '#0a0a0a',
        minHeight: '100vh'
      }}>
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ mb: 4, color: '#fff' }}>
            All Reviews
          </Typography>

          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="error">
              {error?.data?.message || error.error || "Error loading reviews"}
            </Message>
          ) : reviews?.length === 0 ? (
            <Message>No reviews found.</Message>
          ) : (
            <TableContainer component={Paper} sx={{ backgroundColor: '#1a1a1a' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Product</StyledTableCell>
                    <StyledTableCell>User</StyledTableCell>
                    <StyledTableCell>Rating</StyledTableCell>
                    <StyledTableCell>Comment</StyledTableCell>
                    <StyledTableCell>Date</StyledTableCell>
                    <StyledTableCell>Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviews.map((review) => (
                    <StyledTableRow key={review._id}>
                      <StyledTableCell>
                        <ProductLink to={`/product/${review.productId}`}>
                          <Box
                            component="img"
                            src={review.productImage}
                            alt={review.productName}
                            sx={{
                              width: 50,
                              height: 50,
                              objectFit: 'cover',
                              borderRadius: 1
                            }}
                          />
                          {review.productName}
                        </ProductLink>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography sx={{ color: '#fff', fontWeight: 500 }}>
                            {review.user?.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {review.user?.email}
                          </Typography>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {review.rating}
                          <FaStar style={{ color: '#f59e0b' }} />
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>{review.comment}</StyledTableCell>
                      <StyledTableCell>
                        {moment(review.createdAt).format('MMMM DD, YYYY')}
                      </StyledTableCell>
                      <StyledTableCell>
                        <IconButton
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this review?')) {
                              handleDeleteReview(review.productId, review._id);
                            }
                          }}
                          sx={{ color: '#ef4444' }}
                        >
                          <FaTrash />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Container>
      </Box>
    </>
  );
};

export default AllReviews;
