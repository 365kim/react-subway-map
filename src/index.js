import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';

import App from './App';
import store from './redux/store';
import { GlobalStyle } from './style';

ReactDOM.render(
  <SnackbarProvider maxSnack={3}>
    <React.StrictMode>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
      <GlobalStyle />
    </React.StrictMode>
  </SnackbarProvider>,
  document.getElementById('root'),
);
