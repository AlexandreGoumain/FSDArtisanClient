import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import { AuthProvider } from "./context/auth";
import { RoutesApp } from "./router";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <RoutesApp />
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
