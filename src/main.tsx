import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { transitions, positions, Provider as AlertProvider } from "react-alert";

import App from "./App.tsx";
import { config } from "./wagmi.ts";

import "./index.css";

const queryClient = new QueryClient();

const options = {
  position: positions.TOP_RIGHT,
  timeout: 5000,
  offset: "30px",
  transition: transitions.SCALE,
};

const AlertTemplate = ({ style, options, message }: any) => (
  <div
    className={`${options.type === "success" ? "alert-success alert-container" : "alert-error alert-container"}`}
    style={style}
  >
    {message}
  </div>
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AlertProvider template={AlertTemplate} {...options}>
          <App />
        </AlertProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
