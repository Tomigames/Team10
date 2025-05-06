import React, { lazy, Suspense, useContext } from "react";
import { UserContext } from "../pages/UserContext";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { Styles } from "../styles/styles";
import routes from "./config";
import SignupForm from "../pages/Signup"; 

// Lazy import components
const CourseGrades = lazy(() => import("../pages/CourseGrades"));
const LoginPage = lazy(() => import("../pages/LoginPage")); 
const LazyComponents: { [key: string]: React.LazyExoticComponent<any> } = {
  CourseGrades,
  // Add other lazy imports if needed
};

const Router = () => {
<<<<<<< HEAD
  const context = useContext(UserContext) as any;
  const userId = context?.userId;
  const location = useLocation();

  return (
    <Suspense fallback={null}>
      <Styles />
      {/* ✅ hide Header on /login and /signup */}
      {userId && location.pathname !== "/signup" && location.pathname !== "/login" && <Header />}

      <Routes>
        {/* ✅ Route for signup */}
        <Route path="/signup" element={<SignupForm />} />

        {/* ✅ Route for login */}
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

export default Router;
=======
  return (
    <UserProvider> {/* Wrap everything inside UserProvider */}
      <Suspense fallback={null}>
        <Styles />
        <Header />
        <Routes>
          {routes.map((routeItem) => {
            // Handle the case where `path` can be a string or an array of strings
            const Component =
              LazyComponents[routeItem.component] ||
              lazy(() => import(`../pages/${routeItem.component}`));

            // Ensure `routeItem.path` is always an array to map over it
            const paths = Array.isArray(routeItem.path) ? routeItem.path : [routeItem.path];

            return paths.map((path) => (
              <Route
                key={`${routeItem.component}-${path}`} // Unique key for each path
                path={path}
                element={
                  routeItem.component === "CourseGrades" ? (
                    <Component userId={1} /> // Remove hardcoded courseId
                  ) : (
                    <Component />
                  )
                }
              />
            ));
          })}
        </Routes>
      </Suspense>
    </UserProvider>
  );
};

export default Router;
>>>>>>> adfe051f28e9160d54444bd10518be354633d92b
