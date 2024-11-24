import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  styled,
} from "@mui/material";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1A1A1A',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ec4899',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-focused': {
      color: '#ec4899',
    },
  },
  '& .MuiOutlinedInput-input': {
    '&:-webkit-autofill': {
      '-webkit-box-shadow': '0 0 0 100px #1A1A1A inset',
      '-webkit-text-fill-color': 'white',
    },
  },
});

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const [updateProfile, { isLoading }] = useProfileMutation();

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#121212', py: 8 }}>
      <Container maxWidth="md">
        <Box sx={{ pt: 4 }}>
          <Typography variant="h4" color="white" gutterBottom align="center">
            Update Profile
          </Typography>

          {isLoading ? (
            <Loader />
          ) : (
            <Box sx={{ 
              maxWidth: '500px', 
              margin: '0 auto',
              mt: 4
            }}>
              <StyledPaper>
                <Box 
                  component="form" 
                  onSubmit={submitHandler}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3
                  }}
                >
                  <StyledTextField
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />

                  <StyledTextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <StyledTextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <StyledTextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    mt: 2
                  }}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{
                        bgcolor: '#ec4899',
                        color: 'white',
                        py: 1.5,
                        '&:hover': {
                          bgcolor: '#be185d',
                        },
                      }}
                    >
                      Update
                    </Button>

                    <Link to="/user-orders">
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          bgcolor: '#ec4899',
                          color: 'white',
                          py: 1.5,
                          '&:hover': {
                            bgcolor: '#be185d',
                          },
                        }}
                      >
                        My Orders
                      </Button>
                    </Link>
                  </Box>
                </Box>
              </StyledPaper>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Profile;
