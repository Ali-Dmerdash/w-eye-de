"use client";

import React, { useState } from "react";
import {
  Drawer,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Typography,
  ListItemButton,
} from "@mui/material";
import Image from "next/image"; // For handling the image import

import {
  Home,
  BarChart,
  Warning,
  AttachMoney,
  CloudUpload,
  Logout,
  Close,
  Menu,
} from "@mui/icons-material";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import Logo from "@/assets/Logo.png";
import { useRouter } from "next/navigation"; // Use Next.js's useRouter instead of react-router-dom

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter(); // Use Next.js's useRouter

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleNavigation = (path: string) => {
    if (path) {
      router.push(path); // Use router.push for navigation in Next.js
      // Optionally close the drawer on mobile after navigation
      if (window.innerWidth < 600) {
        setOpen(false);
      }
    }
  };

  const navItems = [
    { text: "Home", icon: <Home />, path: "/" },
    { text: "Statistics", icon: <BarChart />, path: "/statistics" },
    { text: "Fraud", icon: <Warning />, path: "/fraud-page" },
    { text: "Revenue", icon: <AttachMoney />, path: "/revenue" },
    { text: "Market", icon: <LocalGroceryStoreIcon />, path: "/market" },
    { text: "Data Upload", icon: <CloudUpload />, path: "/data-upload" }, // Added valid path
  ];

  return (
    <>
      {/* Floating Hamburger Button */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={toggleDrawer}
        sx={{
          position: "fixed",
          left: open ? 270 : 20, // Moves the hamburger to the right when the sidebar is open
          top: 20,
          zIndex: 1300,
          bgcolor: "primary.main",
          color: "white",
          "&:hover": {
            bgcolor: "primary.dark",
          },
          transition: "left 0.3s ease", // Smooth transition when moving
        }}
      >
        {open ? <Close /> : <Menu />}
      </IconButton>

      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        sx={{
          width: open ? 250 : 0, // Set width to 0 when the sidebar is closed
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? 250 : 0, // Same for the paper to ensure no space is occupied when closed
            transition: "width 0.3s ease",
            overflow: "hidden", // Ensure no content is visible when drawer is closed
            backgroundColor: "#121212", // Set the background to dark
            color: "white", // Set the text color to white
          },
        }}
      >
        <Box
          sx={{
            width: 250,
            p: 3,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            justifyContent="space-between"
            alignItems="center"
            textAlign="center"
            flexDirection="column"
            display="flex"
          >
            <Image
              src={Logo || "/placeholder.svg"}
              alt="Logo"
              width={100}
              height={100}
            />
            <Avatar sx={{ my: 1, bgcolor: "secondary.main" }}>U</Avatar>
            <Typography variant="body1">User Name</Typography>
            <Typography variant="body2">user@example.com</Typography>
          </Box>

          <Divider sx={{ my: 2, backgroundColor: "white" }} />

          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.text}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  "&.Mui-selected": {
                    bgcolor: "action.selected",
                  },
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                  color: "white", // Ensure the text is white
                }}
              >
                <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} sx={{ color: "white" }} />
              </ListItemButton>
            ))}
          </List>

          <Divider sx={{ mb: 7, mt: 5, backgroundColor: "white" }} />

          <ListItemButton>
            <ListItemIcon sx={{ color: "white" }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: "white" }} />
          </ListItemButton>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
