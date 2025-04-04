import axios, { Axios, AxiosError, type AxiosRequestConfig } from "axios";
import { apiRoute, connectionError } from "../stores";

class ApiClient {
  instance: Axios;
  constructor() {
    this.instance = axios.create({
      baseURL: apiRoute,
      timeout: 10000,
    });
  }

  private errorHandler(error: any) {
    if (error.code == 'ERR_NETWORK') {
      connectionError.set(500);
    }
    else if (error.response.status == 403) {
      connectionError.set(403);
    }
    else {
      connectionError.set(error.response.status);
    }
    throw error;
  }

  async get(endpoint: string, params?: any) {
    try {
      const response = await this.instance.get(endpoint, { params });
      return response.data;
    } catch (error: any) {
      this.errorHandler(error);
    }
  }

  async post(endpoint: string, data: any, config: AxiosRequestConfig<any> | undefined = undefined) {
    try {
      const response = await this.instance.post(endpoint, data, config);
      return response.data;
    } catch (error: any) {
      this.errorHandler(error);
    }
  }

  async put(endpoint: string, data: any, config: AxiosRequestConfig<any> | undefined = undefined) {
    try {
      const response = await this.instance.put(endpoint, data, config);
      return response.data;
    } catch (error: any) {
      this.errorHandler(error);
    }
  }

  async delete(endpoint: string, data?: any | null) {
    try {
      const response = await this.instance.delete(endpoint,
        {
          data: data,
        }
      );
      return response.data;
    } catch (error: any) {
      this.errorHandler(error);
    }
  }
}

const Api = new ApiClient();
export default Api;
