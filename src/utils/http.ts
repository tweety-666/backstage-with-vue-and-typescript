import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { Message } from 'element-ui';
import router from '@/router';

// axios instance
const service = axios.create({
  timeout: 10000 // 超時
});

// request攔截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (localStorage.tsToken) {
      config.headers.Authorization = localStorage.tsToken;
    }
    return config;
  },
  (err: any) => {
    Promise.reject(err);
  }
);

// response攔截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('response', response)
    return response;
  },
  (err: any) => {
    let errMsg = '';
    if (err && err.response.status) {
      const status = err.response.status
      const msg = err.response.data.msg || ''
      switch (status) {
        case 401:
          errMsg = 'Token is not available,plz login again.';
          localStorage.removeItem('tsToken');
          router.push('/login');
          break;
        default:
          errMsg = `[ERROR] status:${status} / status: ${msg}`;
          break;
      }
    } else {
      errMsg = err;
    }

    Message.error(errMsg);
    return Promise.reject(errMsg);
  }
);

export default service;
