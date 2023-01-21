import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import ErrorPage from "./error-page";
import { Pictures } from "./module/picture/pictures";
import Root from "./Root";

// react-router-dom https://reactrouter.com/en/main/start/tutorial
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/picture",
        element: <Pictures />,
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router = {router} />
  </React.StrictMode>
);
