import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  Category,
  AddBox,
  List as ListIcon,
  People,
  ShoppingCart,
  Close,
  RateReview,
} from "@mui/icons-material";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: "/admin/dashboard", name: "Dashboard", icon: <Dashboard /> },
    { path: "/admin/productlist", name: "Create Product", icon: <AddBox /> },
    { path: "/admin/allproductslist", name: "All Products", icon: <ListIcon /> },
    { path: "/admin/categorylist", name: "Categories", icon: <Category /> },
    { path: "/admin/orderlist", name: "Orders", icon: <ShoppingCart /> },
    { path: "/admin/userlist", name: "Users", icon: <People /> },
    { path: "/admin/reviews", name: "Reviews", icon: <RateReview /> },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <IconButton
        onClick={toggleMenu}
        sx={{
          position: "fixed",
          top: "80px", // Position it below the navbar (70px height + 10px gap)
          right: "20px", // Position from the right
          color: "white",
          zIndex: 1200,
          bgcolor: "#151515",
          "&:hover": {
            bgcolor: "#2E2D2D",
          },
        }}
      >
        {isMenuOpen ? <Close /> : <MenuIcon />}
      </IconButton>

      <Drawer
        anchor="left"
        open={isMenuOpen}
        onClose={toggleMenu}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: "#151515",
            borderRight: "1px solid #333",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              color: "white",
              textAlign: "center",
              borderBottom: "2px solid #333",
              pb: 2,
              mb: 2,
            }}
          >
            Admin Dashboard
          </Typography>

          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.path}
                component={NavLink}
                to={item.path}
                onClick={toggleMenu}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  color: "white",
                  "&.active": {
                    bgcolor: "#ec4899",
                    "& .MuiListItemIcon-root": {
                      color: "white",
                    },
                  },
                  "&:hover": {
                    bgcolor: "#2E2D2D",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default AdminMenu;
