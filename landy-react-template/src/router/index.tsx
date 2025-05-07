// index.tsx
import React, { lazy, Suspense, useContext } from "react";
import { UserProvider, UserContext } from "../pages/UserContext";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { Styles } from "../styles/styles";
import routes from "./config";
import SignupForm from "../pages/Signup";
import LoginPage from "../pages/LoginPage";
import TranscriptDownloader from "../pages/TranscriptDownloader";

const InnerRouter = () => {
  const context = useContext(UserContext) as any;
  const userId = context?.userId;
  const location = useLocation();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Styles />
      {userId && location.pathname !== "/signup" && location.pathname !== "/login" && <Header />}

      <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/transcript" element={userId ? <TranscriptDownloader /> : <Navigate to="/login" />} />

        {routes.map((routeItem) => {
          if (routeItem.path === '/transcript') return null; // Skip since we handle it above
          const Component = lazy(() => import(`../pages/${routeItem.component}`));
          const paths = Array.isArray(routeItem.path) ? routeItem.path : [routeItem.path];

          return paths.map((path) => (
            <Route
              key={`${routeItem.component}-${path}`}
              path={path}
              element={
                userId ? (
                  <Suspense fallback={<div>Loading...</div>}>
                    {routeItem.component === "CourseGrades" ? (
                      <Component userId={userId} />
                    ) : (
                      <Component />
                    )}
                  </Suspense>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          ));
        })}
      </Routes>
    </Suspense>
  );
};

const Router = () => (
  <UserProvider>
    <InnerRouter />
  </UserProvider>
);

export default Router;