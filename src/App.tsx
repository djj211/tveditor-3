import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { ToastProvider } from 'react-toast-notifications';

import ShowsContextProvider from "./Context/shows.context"
import AuthContextProvider from './Context/auth.context';
import Header from "./components/Header";
import theme from "./Theme";
import Routes from "./Routes";

const App = () => {
  return (
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
  );
}

export default App;
