import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Routes/App";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import CoinPage from "./Routes/CoinPage";
import HomePage from "./Routes/HomePage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      {
        path: "/coins/:id",
        element: <CoinPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);