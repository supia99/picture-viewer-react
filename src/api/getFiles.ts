import axios from "axios"

export const getFiles = async (directory: string, sort: string) => {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL
  })
  const response = await axiosInstance.get(`/directory?dir=${directory}&sort=${sort}`)
  return response.data.children
}