import React from 'react';
import axios, { AxiosRequestConfig } from 'axios';

export const useApi = (baseUrl: string) => {
  const getUrl = React.useCallback(
    (inputPath: string) => {
      if (inputPath.charAt(0) === '/') {
        return `${baseUrl}${inputPath}`;
      }

      return `${baseUrl}/${inputPath}`;
    },
    [baseUrl],
  );

  const get = async <T>(path: string, config: AxiosRequestConfig): Promise<T> => {
    const resp = await axios.get<T>(getUrl(path), config);
    return resp.data;
  };

  const post = React.useCallback(
    async <T, TData>(path: string, data?: TData, config?: AxiosRequestConfig): Promise<T> => {
      const resp = await axios.post<T>(getUrl(path), data, config);
      return resp.data;
    },
    [getUrl],
  );

  const put = async <T, TData>(path: string, data?: TData, config?: AxiosRequestConfig): Promise<T> => {
    const resp = await axios.put<T>(getUrl(path), data, config);
    return resp.data;
  };

  const del = async <T>(path: string, config: AxiosRequestConfig): Promise<T> => {
    const resp = await axios.delete<T>(getUrl(path), config);
    return resp.data;
  };

  return {
    get,
    post,
    put,
    del,
  };
};
