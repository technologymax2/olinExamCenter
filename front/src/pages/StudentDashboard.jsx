import React, { useState, useEffect } from 'react';
import { 
  ThemeProvider, CssBaseline, Box, Drawer, AppBar, Toolbar, Typography, 
  List, ListItem, ListItemIcon, ListItemText, Grid, Card, CardContent, Chip 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MessageIcon from '@mui/icons-material/Message';
import logoTheme from '../theme'; // ✅ ትክክል (ከ pages ፎልደር ወጣ ብሎ src/ ስር እንዳለ ያመለክታል)

import axios from 'axios';

const drawerWidth = 260;

function StudentDashboardWithFeed() {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    // ከ Backend የቤት ስራዎችን እና መልዕክቶችን መቀበል
    axios.get('http://localhost:10000/api/student/contents')
      .then(response => setContents(response.data))
      .catch(error => console.error('Error fetching contents:', error));
  }, []);

  return (
    <ThemeProvider theme={logoTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        
        {/* Navbar */}
        <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: '1', fontWeight: 'bold' }}>
              Max Technology - Student Portal
            </Typography>
            <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
              EMPOWERING YOUR REACH
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Drawer
          sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, backgroundColor: '#123758', color: '#fff' } }}
          variant="permanent" anchor="left"
        >
          <Toolbar>
            <Typography variant="h6" sx={{ color: '#d4af37', fontWeight: 'bold' }}>Student Panel</Typography>
          </Toolbar>
          <List>
            <ListItem button><ListItemIcon sx={{ color: '#d4af37' }}><DashboardIcon /></ListItemIcon><ListItemText primary="ዳሽቦርድ" /></ListItem>
            <ListItem button><ListItemIcon sx={{ color: '#d4af37' }}><AssignmentIcon /></ListItemIcon><ListItemText primary="የቤት ስራ እና አሳይንመንት" /></ListItem>
            <ListItem button><ListItemIcon sx={{ color: '#d4af37' }}><MessageIcon /></ListItemIcon><ListItemText primary="መልዕክቶች" /></ListItem>
          </List>
        </Drawer>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, mt: 8 }}>
          <Toolbar />
          <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            የቤት ስራዎች እና መልዕክቶች
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            መምህራን ያስቀመጧቸውን የቤት ስራዎች፣ አሳይንመንቶች እና ማስታወሻዎች ከዚህ በታች ይከታተሉ።
          </Typography>

          {/* Contents Grid */}
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {contents.length === 0 ? (
              <Typography variant="body1" sx={{ p: 3 }}>ምንም አዲስ መረጃ የለም።</Typography>
            ) : (
              contents.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Card sx={{ borderLeft: `5px solid ${item.type === 'homework' ? '#123758' : item.type === 'assignment' ? '#2e7d32' : '#d4af37'}`, boxShadow: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" sx={{ color: '#123758', fontWeight: 'bold' }}>
                          {item.title}
                        </Typography>
                        <Chip 
                          label={item.type === 'homework' ? 'የቤት ስራ' : item.type === 'assignment' ? 'አሳይንመንት' : 'መልዕክት'} 
                          size="small" 
                          color={item.type === 'homework' ? 'primary' : item.type === 'assignment' ? 'success' : 'secondary'} 
                        />
                      </Box>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        {item.description}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.disabled' }}>
                        ቀን: {new Date(item.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>

        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default StudentDashboardWithFeed;
