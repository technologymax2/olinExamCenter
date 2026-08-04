import React, { useState } from 'react';
import { 
  ThemeProvider, CssBaseline, Box, Drawer, AppBar, Toolbar, Typography, 
  List, ListItem, ListItemIcon, ListItemText, Grid, Card, CardContent, 
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MessageIcon from '@mui/icons-material/Message';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import logoTheme from '../theme';
import axios from 'axios';

const drawerWidth = 260;

function TeacherDashboard() {
  const [openModal, setOpenModal] = useState(false);
  const [contentForm, setContentForm] = useState({ title: '', description: '', type: 'homework' });

  const handleSubmit = () => {
    axios.post('http://localhost:10000/api/teacher/contents', contentForm)
      .then(() => {
        alert('ተለቋል!');
        setOpenModal(false);
        setContentForm({ title: '', description: '', type: 'homework' });
      })
      .catch(err => console.error('Error posting content:', err));
  };

  return (
    <ThemeProvider theme={logoTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        
        {/* Navbar */}
        <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: '1', fontWeight: 'bold' }}>
              Max Technology - Teacher Portal
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
            <Typography variant="h6" sx={{ color: '#d4af37', fontWeight: 'bold' }}>Teacher Panel</Typography>
          </Toolbar>
          <List>
            <ListItem button><ListItemIcon sx={{ color: '#d4af37' }}><DashboardIcon /></ListItemIcon><ListItemText primary="ዳሽቦርድ" /></ListItem>
            <ListItem button><ListItemIcon sx={{ color: '#d4af37' }}><AssignmentIcon /></ListItemIcon><ListItemText primary="የቤት ስራ / አሳይንመንት" /></ListItem>
            <ListItem button><ListItemIcon sx={{ color: '#d4af37' }}><MessageIcon /></ListItemIcon><ListItemText primary="የወላጅ መልዕክቶች" /></ListItem>
          </List>
        </Drawer>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, mt: 8 }}>
          <Toolbar />
          <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            እንኳን ደህና መጡ, መምህር!
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            ለተማሪዎች እና ለወላጆች የቤት ስራዎችን፣ አሳይንመንቶችን እና መልዕክቶችን ከዚህ በታች ማስተዳደር ይችላሉ።
          </Typography>

          {/* Quick Actions */}
          <Box sx={{ mt: 3, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              ፈጣን ማስተካከያዎች
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddCircleIcon />} 
              onClick={() => setOpenModal(true)}
              sx={{ mt: 1 }}
            >
              የቤት ስራ፣ አሳይንመንት ወይም መልዕክት ልቀቅ
            </Button>
          </Box>

          {/* Modal for Posting Content */}
          <Dialog open={openModal} onClose={() => setOpenModal(false)}>
            <DialogTitle>አዲስ መረጃ መጫኛ</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: '350px' }}>
              <TextField 
                select 
                label="የይዘቱ ዓይነት" 
                value={contentForm.type} 
                onChange={e => setContentForm({...contentForm, type: e.target.value})} 
                fullWidth
              >
                <MenuItem value="homework">የቤት ስራ (Homework)</MenuItem>
                <MenuItem value="assignment">አሳይንመንት (Assignment)</MenuItem>
                <MenuItem value="message">የወላጅ መልዕክት (Parent Message)</MenuItem>
              </TextField>

              <TextField 
                label="ርዕስ (Title)" 
                fullWidth 
                value={contentForm.title} 
                onChange={e => setContentForm({...contentForm, title: e.target.value})} 
              />

              <TextField 
                label="መግለጫ / ዝርዝር (Description)" 
                multiline 
                rows={4} 
                fullWidth 
                value={contentForm.description} 
                onChange={e => setContentForm({...contentForm, description: e.target.value})} 
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenModal(false)}>ይቅር</Button>
              <Button variant="contained" onClick={handleSubmit}>ለቀቅ</Button>
            </DialogActions>
          </Dialog>

        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default TeacherDashboard;
