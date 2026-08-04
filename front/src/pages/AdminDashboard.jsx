import React, { useState, useEffect } from 'react';
import { 
  ThemeProvider, CssBaseline, Box, Drawer, AppBar, Toolbar, Typography, 
  List, ListItem, ListItemIcon, ListItemText, Grid, Card, CardContent, 
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import logoTheme from './theme';
import axios from 'axios';

const drawerWidth = 260;

function AdminDashboard() {
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalExams: 0 });
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openExamModal, setOpenExamModal] = useState(false);

  // የተጠቃሚ መመዝገቢያ ፎርም ስቴት
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'student', password: '' });
  
  // የፈተና መርሐ-ግብር ስቴት
  const [examForm, setExamForm] = useState({ title: '', subject: '', examDate: '', resultReleaseDate: '', duration: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/stats')
      .then(response => setStats(response.data))
      .catch(error => console.error('Error fetching stats:', error));
  }, []);

  const handleUserSubmit = () => {
    axios.post('http://localhost:5000/api/admin/users', userForm)
      .then(() => { alert('ተጠቃሚው ተመዝግቧል!'); setOpenUserModal(false); })
      .catch(err => console.error(err));
  };

  const handleExamSubmit = () => {
    axios.post('http://localhost:5000/api/admin/exams', examForm)
      .then(() => { alert('ፈተናው እና ቀናቱ ተይዘዋል!'); setOpenExamModal(false); })
      .catch(err => console.error(err));
  };

  return (
    <ThemeProvider theme={logoTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        
        {/* Navbar */}
        <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: '1', fontWeight: 'bold' }}>
              Max Technology - Exam Center Admin
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
            <Typography variant="h6" sx={{ color: '#d4af37', fontWeight: 'bold' }}>Max Admin</Typography>
          </Toolbar>
          <List>
            <ListItem button><ListItemIcon sx={{ color: '#d4af37' }}><DashboardIcon /></ListItemIcon><ListItemText primary="ዳሽቦርድ" /></ListItem>
            <ListItem button><ListItemIcon sx={{ color: '#d4af37' }}><PeopleIcon /></ListItemIcon><ListItemText primary="ተማሪዎች እና መምህራን" /></ListItem>
            <ListItem button><ListItemIcon sx={{ color: '#d4af37' }}><AssessmentIcon /></ListItemIcon><ListItemText primary="የፈተና ባንክና ቀናቶች" /></ListItem>
          </List>
        </Drawer>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, mt: 8 }}>
          <Toolbar />
          <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            የአስተዳደር ዳሽቦርድ
          </Typography>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderLeft: '5px solid #123758' }}>
                <CardContent>
                  <Typography color="textSecondary">ጠቅላላ ተማሪዎች</Typography>
                  <Typography variant="h4" sx={{ color: '#123758', fontWeight: 'bold' }}>{stats.totalStudents}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderLeft: '5px solid #2e7d32' }}>
                <CardContent>
                  <Typography color="textSecondary">ጠቅላላ መምህራን</Typography>
                  <Typography variant="h4" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>{stats.totalTeachers}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderLeft: '5px solid #d4af37' }}>
                <CardContent>
                  <Typography color="textSecondary">የተዘጋጁ ፈተናዎች</Typography>
                  <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 'bold' }}>{stats.totalExams}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Box sx={{ mt: 5, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              ዋና ዋና አስተዳደራዊ ስራዎች
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
              <Button variant="contained" color="primary" onClick={() => setOpenUserModal(true)}>
                ተማሪ/መምህር መዝግብ (ፎርም/ኤክሴል)
              </Button>
              <Button variant="contained" color="secondary" sx={{ color: '#fff' }} onClick={() => setOpenExamModal(true)}>
                ፈተና መርሐ-ግብር አውጣ (Exam Scheduling)
              </Button>
            </Box>
          </Box>

          {/* User Registration Modal */}
          <Dialog open={openUserModal} onClose={() => setOpenUserModal(false)}>
            <DialogTitle>አዲስ ተማሪ ወይም መምህር መዝግብ</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: '350px' }}>
              <TextField label="ሙሉ ስም" fullWidth onChange={e => setUserForm({...userForm, name: e.target.value})} />
              <TextField label="ኢሜል" fullWidth onChange={e => setUserForm({...userForm, email: e.target.value})} />
              <TextField label="የሚስጥር ቁጥር (Password)" type="password" fullWidth onChange={e => setUserForm({...userForm, password: e.target.value})} />
              
              <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
                የኤክሴል ፋይል ሎድ አድርግ (Excel Upload)
                <input type="file" hidden accept=".xlsx, .xls" />
              </Button>
            </DialogContent>
            <DialogContent>
              <Typography variant="caption" color="textSecondary">ወይም ከላይ ያሉትን ፎርሞች ሞልተው ያስገቡ።</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenUserModal(false)}>ይቅር</Button>
              <Button variant="contained" onClick={handleUserSubmit}>መዝግብ</Button>
            </DialogActions>
          </Dialog>

          {/* Exam Scheduling Modal */}
          <Dialog open={openExamModal} onClose={() => setOpenExamModal(false)}>
            <DialogTitle>የፈተና መርሐ-ግብር እና የውጤት ቀን ማቀናበሪያ</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: '350px' }}>
              <TextField label="የፈተና ርዕስ (Title)" fullWidth onChange={e => setExamForm({...examForm, title: e.target.value})} />
              <TextField label="ትምህርት ዓይነት (Subject)" fullWidth onChange={e => setExamForm({...examForm, subject: e.target.value})} />
              <TextField label="የፈተና የሚሰጥበት ቀን እና ሰዓት" type="datetime-local" InputLabelProps={{ shrink: true }} fullWidth onChange={e => setExamForm({...examForm, examDate: e.target.value})} />
              <TextField label="ውጤት የሚገለጽበት ቀን" type="datetime-local" InputLabelProps={{ shrink: true }} fullWidth onChange={e => setExamForm({...examForm, resultReleaseDate: e.target.value})} />
              <TextField label="የቆይታ ጊዜ (በደቂቃ)" type="number" fullWidth onChange={e => setExamForm({...examForm, duration: e.target.value})} />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenExamModal(false)}>ይቅር</Button>
              <Button variant="contained" onClick={handleExamSubmit}>ቀን ቆርጥ መዝግብ</Button>
            </DialogActions>
          </Dialog>

        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default AdminDashboard;
