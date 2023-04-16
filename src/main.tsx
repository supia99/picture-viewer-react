import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PictureApp from "./PictureApp";
import ErrorPage from "./error-page";
import { Home } from "./module/home/home";
import DoujinnomoriApp from "./DoujinnomoriApp";
import { Wnacg } from "./module/wnacg/wnacg";
import WnacgApp from "./module/wnacg/WnacgApp";

// react-router-dom https://reactrouter.com/en/main/start/tutorial
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/picture/*",
    element: <PictureApp />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/doujinnomori/*",
    element: <DoujinnomoriApp />,
    errorElement: <ErrorPage />,
  },{
    path: "/wnacg/*",
    element: <WnacgApp />
  }

]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
