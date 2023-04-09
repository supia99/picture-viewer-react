import axios from "axios";
import { DoujinnmoriObject } from "../model/DoujinnomoriObject";

export const getDoujinnomori = async (
  pageNo: number
): Promise<DoujinnmoriObject[]> => {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL + "/relay/doujinnomori",
  });
  const response = await axiosInstance.get(
    `/comics?page=${pageNo}`
  );
  console.log(response)
  return response.data;
};
