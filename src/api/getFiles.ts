import axios from "axios";
import { Directory } from "../model/Directory";

export const getFiles = async (
  directory: string,
  sort: string
): Promise<Directory> => {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  });
  const response = await axiosInstance.get(
    `/directory?dir=${directory}&sort=${sort}`
  );
  return response.data;
};
