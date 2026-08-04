import { createTheme } from '@mui/material/styles';

const logoTheme = createTheme({
  palette: {
    primary: {
      main: '#123758', // ከሎጎው የተወሰደ ጥልቅ ሰማያዊ (Navy Blue)
    },
    secondary: {
      main: '#d4af37', // ከሎጎው የተወሰደ ወርቃማ (Gold/Amber) رنگ
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

export default logoTheme;
