import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { ToastProvider } from 'react-toast-notifications';

import ShowsContextProvider from "./Context/shows.context"
import Header from "./components/Header";
import theme from "./Theme";
import Shows from './components/Shows';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <ToastProvider autoDismiss={true} newestOnTop={true}>
        <Header />
        <ShowsContextProvider>
          <Shows />
        </ShowsContextProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
