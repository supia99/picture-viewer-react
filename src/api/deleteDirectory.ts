import axios from "axios";

export const deleteDirectory = async (directory: string) => {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  });
  const targetDirecotry = `${directory}`;
  console.log(`targetDirecotry: ${targetDirecotry}`);
  const response = await axiosInstance.get(
    `/deleteDirectory?dir=${targetDirecotry}`
  );
  console.log(response);
};
