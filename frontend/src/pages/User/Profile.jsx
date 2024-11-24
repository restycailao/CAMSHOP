import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { uploadImageToCloudinary } from "../../utils/cloudinaryUtils";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  styled,
  IconButton,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

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
  const [profilePicture, setProfilePicture] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username);
      setEmail(userInfo.email);
      setProfilePicture(userInfo.profilePicture);
    }
  }, [userInfo]);

  const [updateProfile, { isLoading }] = useProfileMutation();

  const dispatch = useDispatch();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const uploadImageHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await uploadImageToCloudinary(file);
      setProfilePicture(imageUrl);
      
      // Update profile with new image URL
      const res = await updateProfile({
        _id: userInfo._id,
        username,
        email,
        profilePicture: imageUrl
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      
      setUploading(false);
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Error uploading image");
      setUploading(false);
    }
  };

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
          profilePicture
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
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" color="white" gutterBottom align="center">
              Update Profile
            </Typography>
            
            {/* Profile Picture Display */}
            <Box 
              sx={{ 
                width: 150,
                height: 150,
                position: 'relative',
                mb: 3,
                cursor: 'pointer'
              }}
              onClick={handleImageClick}
            >
              <Box
                component="img"
                src={profilePicture || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                alt="Profile"
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #ec4899'
                }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: '#ec4899',
                  '&:hover': {
                    backgroundColor: '#be185d',
                  },
                }}
              >
                <PhotoCamera sx={{ color: 'white' }} />
              </IconButton>
              <input
                type="file"
                ref={fileInputRef}
                onChange={uploadImageHandler}
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
              />
            </Box>
          </Box>

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

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" color="white" gutterBottom>
                      Update Profile Picture
                    </Typography>
                    {uploading && <Loader />}
                  </Box>

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
