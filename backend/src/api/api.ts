import axiosCreate, { AxiosResponse } from "axios";

//left the file as template for base structure

const axios = axiosCreate.create({  //base example
  baseURL: "URL", 
  headers: {
    "Content-Type": "application/json",
    withCredentials: true,
    Access: "*",
  },
});

export const API = {

  corrector: (body: any): Promise<AxiosResponse> => {
    return axios.post<{}, AxiosResponse, {}>(
      `/`,
      body,
    );
  },

};
