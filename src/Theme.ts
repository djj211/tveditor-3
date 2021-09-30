import { createTheme } from '@mui/material/styles';
import { blue, green } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: blue,
    secondary: green,
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'standard',
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          zIndex: 900,
        },
      },
    },
  },
});

export default theme;
