import React from 'react';
import { AxiosRequestConfig } from 'axios';

import { useAuth } from '../Context/auth.context';
import { useApi } from './useApi';

const BASE_URL = `${process.env.REACT_APP_PROXY_API_URL!}/api`;

export const useProxyBase = () => {
  const { get: apiGet, post: apiPost, put: apiPut, del: apiDel } = useApi(BASE_URL);
  const { getToken } = useAuth();

  const getConfig = React.useCallback(async (): Promise<AxiosRequestConfig> => {
    const token = await getToken();
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  }, [getToken]);

  const get = async <T>(path: string): Promise<T> => {
    const config = await getConfig();
    return apiGet<T>(path, config);
  };

  const post = React.useCallback(
    async <T, TData>(path: string, data?: TData): Promise<T> => {
      const config = await getConfig();
      return apiPost<T, TData>(path, data, config);
    },
    [getConfig, apiPost],
  );

  const put = async <T, TData>(path: string, data?: TData): Promise<T> => {
    const config = await getConfig();
    return apiPut<T, TData>(path, data, config);
  };

  const del = async <T>(path: string): Promise<T> => {
    const config = await getConfig();
    return apiDel<T>(path, config);
  };

  return {
    get,
    post,
    put,
    del,
  };
};
