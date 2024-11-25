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
  const [updateUser] = useUpdateUserMutation();

  const [editMode, setEditMode] = useState({});
  const [editValues, setEditValues] = useState({});

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (userId) => {
    setEditMode((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
    if (!editMode[userId]) {
      const user = users.find((u) => u._id === userId);
      setEditValues((prev) => ({
        ...prev,
        [userId]: {
          name: user.username,
          email: user.email,
        },
      }));
    }
  };

  const handleUpdate = async (userId) => {
    try {
      await updateUser({
        userId,
        username: editValues[userId].name,
        email: editValues[userId].email,
      });
      setEditMode((prev) => ({ ...prev, [userId]: false }));
      refetch();
      toast.success("User updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Box className="flex min-h-screen bg-[#0E0E0E]">
      <AdminMenu />
      <Box sx={{ flexGrow: 1, p: 4, pt: 12 }}>
        <Typography variant="h4" sx={{ mb: 4, color: 'white' }}>
          Users
        </Typography>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="error">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <TableContainer component={Paper} sx={{ backgroundColor: '#1a1a1a', borderRadius: 2 }}>
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
                {users?.map((user) => (
                  <StyledTableRow key={user._id}>
                    <StyledTableCell>{user._id}</StyledTableCell>
                    <StyledTableCell>
                      {editMode[user._id] ? (
                        <StyledTextField
                          value={editValues[user._id]?.name || ""}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              [user._id]: {
                                ...prev[user._id],
                                name: e.target.value,
                              },
                            }))
                          }
                          size="small"
                        />
                      ) : (
                        user.username
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      {editMode[user._id] ? (
                        <StyledTextField
                          value={editValues[user._id]?.email || ""}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              [user._id]: {
                                ...prev[user._id],
                                email: e.target.value,
                              },
                            }))
                          }
                          size="small"
                        />
                      ) : (
                        user.email
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      {user.isAdmin ? (
                        <FaCheck style={{ color: "green" }} />
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      {!user.isAdmin && (
                        <>
                          <IconButton
                            onClick={() =>
                              editMode[user._id]
                                ? handleUpdate(user._id)
                                : toggleEdit(user._id)
                            }
                            sx={{ color: "white" }}
                          >
                            <FaEdit />
                          </IconButton>
                          <IconButton
                            onClick={() => deleteHandler(user._id)}
                            sx={{ color: "#ef4444" }}
                          >
                            <FaTrash />
                          </IconButton>
                        </>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default UserList;
