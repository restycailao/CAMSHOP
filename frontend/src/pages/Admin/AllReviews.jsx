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

  const handleDeleteReview = (productId, reviewId) => {
    toast.info(
      <Box>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.primary' }}>
            Are you sure you want to delete this review?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end', gap: 1 }}>
          <Button
            onClick={() => {
              deleteReview({ productId, reviewId })
                .unwrap()
                .then(() => {
                  toast.success("Review deleted successfully");
                  refetch();
                })
                .catch((err) => {
                  toast.error(err?.data?.message || err.error || "Error deleting review");
                });
              toast.dismiss();
            }}
            variant="contained"
            color="error"
            size="small"
          >
            Delete
          </Button>
          <Button
            onClick={() => toast.dismiss()}
            variant="contained"
            color="inherit"
            size="small"
          >
            Cancel
          </Button>
        </DialogActions>
      </Box>,
      {
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="error">{error?.data?.message || error.error}</Message>;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0E0E0E' }}>
      <AdminMenu />
      <Box sx={{ flexGrow: 1, pt: 11, px: 3 }}>
        <Paper 
          elevation={0}
          sx={{ 
            bgcolor: '#151515',
            borderRadius: 2,
            p: 3,
            mb: 3,
          }}
        >
          <Typography variant="h5" component="h1" sx={{ color: '#fff', mb: 3, fontWeight: 600 }}>
            Product Reviews
          </Typography>

          {reviews?.length === 0 ? (
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', py: 2 }}>
              No reviews found
            </Typography>
          ) : (
            <TableContainer>
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
                  {reviews?.map((review) => (
                    <StyledTableRow key={review._id}>
                      <StyledTableCell>
                        <ProductLink to={`/product/${review.productId}`}>
                          <Box
                            component="img"
                            src={review.productImage}
                            alt={review.productName}
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 1,
                              objectFit: 'cover'
                            }}
                          />
                          <Typography>{review.productName}</Typography>
                        </ProductLink>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography sx={{ color: '#fff' }}>{review.user.name}</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {review.user.email}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box sx={{ display: 'flex', color: '#faaf00' }}>
                          {[...Array(review.rating)].map((_, index) => (
                            <FaStar key={index} style={{ marginRight: 4 }} />
                          ))}
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography sx={{ color: '#fff' }}>{review.comment}</Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {moment(review.createdAt).format('MMMM Do YYYY')}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <IconButton
                          onClick={() => handleDeleteReview(review.productId, review._id)}
                          size="small"
                          sx={{ 
                            color: '#ef4444',
                            '&:hover': {
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            }
                          }}
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
        </Paper>
      </Box>
    </Box>
  );
};

export default AllReviews;
