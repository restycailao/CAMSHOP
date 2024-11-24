import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  TextField,
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

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  '& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ec4899',
  },
});

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");
  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
        refetch();
        toast.success("User deleted successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
      toast.success("User updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

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
            Users
          </Typography>

          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>ID</StyledTableCell>
                    <StyledTableCell>NAME</StyledTableCell>
                    <StyledTableCell>EMAIL</StyledTableCell>
                    <StyledTableCell>ADMIN</StyledTableCell>
                    <StyledTableCell>ACTIONS</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <StyledTableRow key={user._id}>
                      <StyledTableCell>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {user._id}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        {editableUserId === user._id ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <StyledTextField
                              size="small"
                              value={editableUserName}
                              onChange={(e) => setEditableUserName(e.target.value)}
                              fullWidth
                            />
                            <IconButton
                              onClick={() => updateHandler(user._id)}
                              sx={{ 
                                color: '#10B981',
                                '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.1)' }
                              }}
                            >
                              <FaCheck />
                            </IconButton>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography>{user.username}</Typography>
                            <IconButton
                              onClick={() => toggleEdit(user._id, user.username, user.email)}
                              size="small"
                              sx={{ 
                                color: '#ec4899',
                                '&:hover': { backgroundColor: 'rgba(236, 72, 153, 0.1)' }
                              }}
                            >
                              <FaEdit />
                            </IconButton>
                          </Box>
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        {editableUserId === user._id ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <StyledTextField
                              size="small"
                              value={editableUserEmail}
                              onChange={(e) => setEditableUserEmail(e.target.value)}
                              fullWidth
                            />
                            <IconButton
                              onClick={() => updateHandler(user._id)}
                              sx={{ 
                                color: '#10B981',
                                '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.1)' }
                              }}
                            >
                              <FaCheck />
                            </IconButton>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography
                              component="a"
                              href={`mailto:${user.email}`}
                              sx={{ 
                                color: '#fff',
                                textDecoration: 'none',
                                '&:hover': { color: '#ec4899' }
                              }}
                            >
                              {user.email}
                            </Typography>
                            <IconButton
                              onClick={() => toggleEdit(user._id, user.username, user.email)}
                              size="small"
                              sx={{ 
                                color: '#ec4899',
                                '&:hover': { backgroundColor: 'rgba(236, 72, 153, 0.1)' }
                              }}
                            >
                              <FaEdit />
                            </IconButton>
                          </Box>
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        {user.isAdmin ? (
                          <FaCheck style={{ color: "#10B981" }} />
                        ) : (
                          <FaTimes style={{ color: "#EF4444" }} />
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        {!user.isAdmin && (
                          <IconButton
                            onClick={() => deleteHandler(user._id)}
                            sx={{ 
                              color: '#EF4444',
                              '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' }
                            }}
                          >
                            <FaTrash />
                          </IconButton>
                        )}
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

export default UserList;
