import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";

import { AuthGuard } from "@/components/AuthGuard";
import { RoutesApp } from "@/router";
import { persistor, store } from "@/store/store";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <PersistGate
                loading={
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                    </div>
                }
                persistor={persistor}
            >
                <BrowserRouter>
                    <AuthGuard>
                        <RoutesApp />
                    </AuthGuard>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    </StrictMode>
);
