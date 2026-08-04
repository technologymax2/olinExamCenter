import React, { useState, useEffect } from 'react';
import { 
  ThemeProvider, 
  CssBaseline, 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Grid, 
  Card, 
  CardContent, 
  Button 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import logoTheme from './theme'; // ከላይ የሰራነውን ቴማ ማስገባት
import axios from 'axios';

const drawerWidth = 240;

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalExams: 0
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/stats')
      .then(response => setStats(response.data))
      .catch(error => console.error('Error fetching stats:', error));
  }, []);

  return (
    <ThemeProvider theme={logoTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        
        {/* የላይኛው አሞሌ (Navbar) */}
        <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#fff', fontWeight: 'bold' }}>
              Max Technology - Exam Portal Admin
            </Typography>
            <Typography variant="body2" sx={{ color: '#d4af37', fontWeight: 'bold' }}>
              EMPOWERING YOUR REACH
            </Typography>
          </Toolbar>
        </AppBar>

        {/* የጎን ሜኑ (Sidebar) */}
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#123758',
              color: '#fff',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar>
            <Typography variant="h6" sx={{ color: '#d4af37', fontWeight: 'bold' }}>
              Max Admin
            </Typography>
          </Toolbar>
          <List>
            <ListItem button sx={{ '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.2)' } }}>
              <ListItemIcon sx={{ color: '#d4af37' }}><DashboardIcon /></ListItemIcon>
              <ListItemText primary="ዳሽቦርድ" />
            </ListItem>
            <ListItem button sx={{ '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.2)' } }}>
              <ListItemIcon sx={{ color: '#d4af37' }}><PeopleIcon /></ListItemIcon>
              <ListItemText primary="ተማሪዎች" />
            </ListItem>
            <ListItem button sx={{ '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.2)' } }}>
              <ListItemIcon sx={{ color: '#d4af37' }}><SchoolIcon /></ListItemIcon>
              <ListItemText primary="መምህራን" />
            </ListItem>
            <ListItem button sx={{ '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.2)' } }}>
              <ListItemIcon sx={{ color: '#d4af37' }}><AssessmentIcon /></ListItemIcon>
              <ListItemText primary="ፈተናዎች" />
            </ListItem>
          </List>
        </Drawer>

        {/* ዋናው የይዘት አካባቢ (Main Content) */}
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, mt: 8 }}>
          <Toolbar />
          
          <Typography variant="h4" gutterBottom sx={{ color: '#123758', fontWeight: 'bold' }}>
            እንኳን ደህና መጡ!
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            የማክ ቴክኖሎጂ የፈተና አስተዳደር ማዕከል አጠቃላይ መረጃዎች እዚህ ይታያሉ።
          </Typography>

          {/* የስታቲስቲክስ ካርዶች */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderLeft: '5px solid #123758', boxShadow: 3 }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>ጠቅላላ ተማሪዎች</Typography>
                  <Typography variant="h4" sx={{ color: '#123758', fontWeight: 'bold' }}>
                    {stats.totalStudents}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card sx={{ borderLeft: '5px solid #2e7d32', boxShadow: 3 }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>ጠቅላላ መምህራን</Typography>
                  <Typography variant="h4" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                    {stats.totalTeachers}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card sx={{ borderLeft: '5px solid #d4af37', boxShadow: 3 }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>ጠቅላላ ፈተናዎች</Typography>
                  <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                    {stats.totalExams}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* ፈጣን አቋራጮች (Quick Actions) */}
          <Box sx={{ mt: 5, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#123758' }}>
              ፈጣን ማስተካከያዎች
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
              <Button variant="contained" color="primary">
                አዲስ ተማሪ መዝግብ
              </Button>
              <Button variant="contained" color="secondary" sx={{ color: '#fff' }}>
                ፈተና ፍጠር
              </Button>
              <Button variant="outlined" color="primary">
                ሪፖርት አውጣ
              </Button>
            </Box>
          </Box>

        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default AdminDashboard;
