import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Box,
} from "@mui/material";
import {
  Home,
  Shop,
  ShoppingCart,
  Favorite,
  Login,
  PersonAdd,
  ArrowDropDown,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const favorites = useSelector((state) => state.favorites);

  // Change dropdown state management to work with Material UI Menu
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      handleMenuClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#000",
        height: "70px",
        zIndex: 1200, // Higher z-index to stay above sidebar
      }}
    >
      <Toolbar sx={{ height: "100%" }}>
        {/* Left side navigation items */}
        <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
          <Button
            component={Link}
            to="/"
            color="inherit"
            startIcon={<Home />}
          >
            Home
          </Button>

          <Button
            component={Link}
            to="/shop"
            color="inherit"
            startIcon={<Shop />}
          >
            Shop
          </Button>

          <Button
            component={Link}
            to="/cart"
            color="inherit"
            startIcon={
              <Badge badgeContent={cartItems.reduce((a, c) => a + c.qty, 0)} color="error">
                <ShoppingCart />
              </Badge>
            }
          >
            Cart
          </Button>

          <Button
            component={Link}
            to="/favorite"
            color="inherit"
            startIcon={
              <Badge badgeContent={favorites.length} color="error">
                <Favorite />
              </Badge>
            }
          >
            Favorites
          </Button>
        </Box>

        {/* Right side auth section */}
        {userInfo ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                component="img"
                src={userInfo.profilePicture || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                alt={userInfo.username}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #fff'
                }}
              />
              <Typography variant="subtitle1">
                {userInfo.username}
              </Typography>
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <ArrowDropDown />
              </IconButton>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  bgcolor: '#1a1a1a',
                  color: 'white',
                  '& .MuiMenuItem-root': {
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                    },
                  },
                },
              }}
            >
              {userInfo.isAdmin && [
                <MenuItem key="dashboard" component={Link} to="/admin/dashboard" onClick={handleMenuClose}>
                  Dashboard
                </MenuItem>
              ]}
              <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                Profile
              </MenuItem>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              component={Link}
              to="/login"
              color="inherit"
              startIcon={<Login />}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/register"
              color="inherit"
              startIcon={<PersonAdd />}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
