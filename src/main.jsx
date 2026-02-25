import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "./index.css";

import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import GameDetail from "./pages/GameDetail";
import FilteredGames from "./pages/FilteredGames";
import Publishers from "./pages/Publishers";
import PublisherDetail from "./pages/PublisherDetail";
import Events from "./pages/Events";
import MyEvents from "./pages/MyEvents";

import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "search", element: <Search /> },
      { path: "favorites", element: <Favorites /> },
      { path: "games/:id", element: <GameDetail /> },
      { path: "tags/:slug", element: <FilteredGames type="tags" /> },
      { path: "genres/:slug", element: <FilteredGames type="genres" /> },
      { path: "publishers", element: <Publishers /> },
      { path: "publishers/:id", element: <PublisherDetail /> },
      { path: "events", element: <Events /> },
      { path: "my-events", element: <MyEvents /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);