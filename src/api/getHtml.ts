import axios from "axios";

export const getHtml = async ({
  url,
  target,
}: {
  url: string;
  target: string;
}) => {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL + "/relay/",
  });
  const response = await axiosInstance.get(`${target}/?url=${url}`);
  console.log(response);

  // TODO:
  return (response.data as string)
    .replaceAll('href="/', 'href="https://www.wnacg.com/')
    .replaceAll('<a href="https://www.wnacg.com/', '<a href="/wnacg/')
    .replaceAll(".html", "")
    .replaceAll("albums-index-cate-5", "albums-index-cate-12")
    .replaceAll("albums-index-cate-6", "albums-index-cate-13")
    .replaceAll("albums-index-cate-7", "albums-index-cate-14")
    .replaceAll("/wnacg/photos-index-", "/wnacg/photos-slide-");
};
