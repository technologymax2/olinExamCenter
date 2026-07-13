import React, { useState } from 'react';
import { ListItemButton, ListItemIcon, ListItemText, Drawer, IconButton } from '@mui/material';
import { Dashboard as DashboardIcon, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from "react-router-dom";
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles((theme) => ({
  navbar: {
    width: '22%',
    height: '100vh',
    backgroundColor: '#333',
    color: '#fff',
    position: 'fixed',
    zIndex: 1,
    top: 0,
    left: 0,
    transition: 'transform 0.3s ease-in-out',
    overflowY: 'auto',
    paddingTop: '15vh', // 3% of the screen height
  },
  menuButton: {
    position: 'fixed',
    zIndex: 2,
    top: '16px',
    left: '16px',
  },
  listItem: {
    '&:hover': {
      backgroundColor: 'white', // Background color on hover
      color: 'black',
     // Text color on hover
    },
  },
  activePage: {
    backgroundColor: '#fff', // Background color for the active page
    color: '#333', // Text color for the active page
  },
}));

function Contact() {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <IconButton className={classes.menuButton} onClick={toggleDrawer}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <div className={classes.navbar}>
          <ListItemButton
            className={`${classes.listItem} ${location.pathname === '/addUser' ? classes.activePage : ''}`}
            onClick={() => navigate('/addUser')}
          >
            
            <ListItemText primary="Add User" />
          </ListItemButton>
          <ListItemButton
            className={`${classes.listItem} ${location.pathname === '/addSection' ? classes.activePage : ''}`}
            onClick={() => navigate('/addSection')}
          >
          
            <ListItemText primary="Add New Section" />
          </ListItemButton>

          <ListItemButton
            className={`${classes.listItem} ${location.pathname === '/logo' ? classes.activePage : ''}`}
            onClick={() => navigate('/logo')}
          >
          
            <ListItemText primary="Upload Logo" />
          </ListItemButton>
          <ListItemButton
            className={`${classes.listItem} ${location.pathname === '/comment-View' ? classes.activePage : ''}`}
            onClick={() => navigate('/comment-view')}
          >
         
            <ListItemText primary="View Comments" />
          </ListItemButton>
          <ListItemButton
            className={`${classes.listItem} ${location.pathname === '/addcategory' ? classes.activePage : ''}`}
            onClick={() => navigate('/addcategory')}
          >
          
            <ListItemText primary="Add New Category" />
          </ListItemButton>
          <ListItemButton
            className={`${classes.listItem} ${location.pathname === '/Home' ? classes.activePage : ''}`}
            onClick={() => navigate('/Allitems')} 
          >
          
            <ListItemText primary="Logout" />
          </ListItemButton>
       
        </div>
      </Drawer>
    </>
  );
}

export default Contact;
