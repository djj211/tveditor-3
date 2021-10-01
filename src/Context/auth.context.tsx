import React from 'react';
import jwt_decode from 'jwt-decode';

import { useApi } from '../hooks/useApi';
import { DecodedToken } from '../interfaces';

interface AuthContextType {
  isAuthenticated: boolean;
  usingProxy: boolean;
  getToken: () => Promise<string | undefined>;
  login: (username: string, password: string) => Promise<boolean>;
  checkAuthenticated: () => boolean;
}

const initialState: AuthContextType = {
  isAuthenticated: false,
  usingProxy: true,
  getToken: async () => {
    return undefined;
  },
  login: async (_username: string, _password: string) => {
    return false;
  },
  checkAuthenticated: () => false,
};

const BASE_URL = `${process.env.REACT_APP_PROXY_API_URL!}/auth`;
const AuthContext = React.createContext<AuthContextType>(initialState);

const AuthContextProvider = ({ children }: { children?: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const { post } = useApi(BASE_URL);

  const usingProxy = !!process.env.REACT_APP_PROXY_API_URL;

  const checkAuthenticated = React.useCallback(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    return !!refreshToken;
  }, []);

  React.useEffect(() => {
    const authenticated = checkAuthenticated();
    setIsAuthenticated(authenticated);
  }, [checkAuthenticated, setIsAuthenticated]);

  const getToken = async () => {
    const token = localStorage.getItem('authToken');
    // Is there a token in storage and has it expired.
    // If not return the token
    if (token) {
      const decoded: DecodedToken = jwt_decode(token);
      const currTime = new Date().getTime();

      if (decoded.exp * 1000 > currTime) {
        return token;
      }
    }

    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      // Token has expired get new token and update local storage.
      const data = await post<{ token: string }, { refreshToken: string }>('refresh', {
        refreshToken: refreshToken,
      });

      if (data.token) {
        localStorage.setItem('authToken', data.token);
        setIsAuthenticated(true);
        return data.token;
      }
    }

    setIsAuthenticated(false);
    return;
  };

  const login = async (username: string, password: string) => {
    const data = await post<{ token: string; refreshToken: string }, { username: string; password: string }>('login', {
      username: username,
      password: password,
    });

    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      setIsAuthenticated(true);
      return true;
    }

    setIsAuthenticated(false);
    return false;
  };

  const value: AuthContextType = {
    isAuthenticated,
    usingProxy,
    login,
    getToken,
    checkAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);

export default AuthContextProvider;
