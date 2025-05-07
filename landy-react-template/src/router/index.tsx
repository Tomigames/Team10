// index.tsx
import React, { lazy, Suspense, useContext } from "react";
import { UserProvider, UserContext } from "../pages/UserContext";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { Styles } from "../styles/styles";
import routes from "./config";
import SignupForm from "../pages/Signup";
 
const CourseGrades = lazy(() => import("../pages/CourseGrades"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const LazyComponents: { [key: string]: React.LazyExoticComponent<any> } = {
  CourseGrades,
};
 
const InnerRouter = () => {
  const context = useContext(UserContext) as any;
  const userId = context?.userId;
  const location = useLocation();
 
  return (
    <Suspense fallback={null}>
      <Styles />
      {/* Hide header on login/signup pages */}
      {userId && location.pathname !== "/signup" && location.pathname !== "/login" && <Header />}
 
      <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginPage />} />
 
        {routes.map((routeItem) => {
          const Component =
            LazyComponents[routeItem.component] ||
            lazy(() => import(`../pages/${routeItem.component}`));
          const paths = Array.isArray(routeItem.path) ? routeItem.path : [routeItem.path];
 
          return paths.map((path) => (
            <Route
              key={`${routeItem.component}-${path}`}
              path={path}
              element={
                userId ? (
                  routeItem.component === "CourseGrades" ? (
                    <Component userId={userId} />
                  ) : (
                    <Component />
                  )
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