import React from 'react';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material/styles';
import { ToastProvider } from 'react-toast-notifications';

import ShowsContextProvider from "./Context/shows.context"
import AuthContextProvider from './Context/auth.context';
import Header from "./components/Header";
import theme from "./Theme";
import Routes from "./Routes";


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


const App = () => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <ToastProvider autoDismiss={true} newestOnTop={true}>
          <AuthContextProvider>
            <Header />
            <ShowsContextProvider>
              <Routes />
            </ShowsContextProvider>
          </AuthContextProvider>
        </ToastProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
