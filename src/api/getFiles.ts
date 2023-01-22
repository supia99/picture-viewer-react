import axios from "axios";
import { File } from "../model/File";

export const getFiles = async (
  directory: string,
  sort: string
): Promise<File[]> => {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  });
  const response = await axiosInstance.get(
    `/directory?dir=${directory}&sort=${sort}`
  );
  return response.data.children;
};
