import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, CssBaseline, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import logoTheme from './theme';

// የ ዳሽቦርድ ገጾች (አስቀድመው የፈጠርናቸው)
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';

function Home() {
  return (
    <Box sx={{ textAlign: 'center', mt: 10, p: 3 }}>
      <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}>
        እንኳን ወደ ማክ ቴክኖሎጂ የፈተና ማዕከል በደህና መጡ
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        እባክዎ ለመግባት የሚፈልጉትን ፖርታል ይምረጡ፡
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
        <Button variant="contained" color="primary" component={Link} to="/admin">
          የአድሚን ፖርታል
        </Button>
        <Button variant="contained" color="secondary" component={Link} to="/teacher" sx={{ color: '#fff' }}>
          የመምህር ፖርታል
        </Button>
        <Button variant="outlined" color="primary" component={Link} to="/student">
          የተማሪ ፖርታል
        </Button>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={logoTheme}>
      <CssBaseline />
      <Router>
        {/* ዋናው የላይኛው አሞሌ (Global Navbar) */}
        <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#d4af37' }}>
              Max Technology Exam System
            </Typography>
            <Button color="inherit" component={Link} to="/">መነሻ</Button>
            <Button color="inherit" component={Link} to="/admin">አድሚን</Button>
            <Button color="inherit" component={Link} to="/teacher">መምህር</Button>
            <Button color="inherit" component={Link} to="/student">ተማሪ</Button>
          </Toolbar>
        </AppBar>

        {/* ሮውቶች (Routes) ማዋቀሪያ */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
