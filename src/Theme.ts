import { createTheme } from '@material-ui/core/styles';
import { blue, green } from '@material-ui/core/colors'

const theme = createTheme({
    palette: {
        primary: blue,
        secondary: green,
    },
    overrides: {
        MuiDialog: {
            root: {
              zIndex: 999
            }
        }
    }
});

export default theme;