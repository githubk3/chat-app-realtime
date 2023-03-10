import React, { useContext, memo } from "react";
import { Routes, Route } from "react-router-dom";
import { MantineProvider, useMantineColorScheme } from "@mantine/core";
import {
    AUTH_ROOT_ROUTE,
    AUTH_LOGIN_ROUTE,
    AUTH_REGISTER_ROUTE,
    CHAT_ROOT_ROUTE,
} from "./configs/routes.config";
import { NotificationsProvider } from "@mantine/notifications";
import { AuthLayout, ChatLayout } from "./layouts";
import { LoginAuth, RegisterAuth } from "./components/AuthComponent";
import { AuthContext } from "./contexts/AuthContext";

function App() {
    const { loading } = useContext(AuthContext);
    const { colorScheme } = useMantineColorScheme();

    return (
        <MantineProvider
            theme={{ colorScheme: colorScheme }}
            withGlobalStyles
            withNormalizeCSS
        >
            <NotificationsProvider>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <Routes>
                        <Route path={AUTH_ROOT_ROUTE} element={<AuthLayout />}>
                            <Route
                                path={AUTH_LOGIN_ROUTE}
                                element={<LoginAuth />}
                            />
                            <Route
                                path={AUTH_REGISTER_ROUTE}
                                element={<RegisterAuth />}
                            />
                        </Route>
                        <Route
                            path={CHAT_ROOT_ROUTE}
                            element={<ChatLayout />}
                        ></Route>
                    </Routes>
                )}
            </NotificationsProvider>
        </MantineProvider>
    );
}

export default memo(App);
