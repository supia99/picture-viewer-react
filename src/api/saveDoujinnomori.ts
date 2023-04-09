import axios from "axios";

export const saveDoujinnomori = async ({uuid, title}: {uuid: string, title: string}) => {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  });
  const response = await axiosInstance.get(
    `/doujinnomori?uuid=${uuid}&title=${title}`
  );
  return {status: response.status,data: response.data};
}