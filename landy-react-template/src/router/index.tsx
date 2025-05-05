import React, { lazy, Suspense, useContext } from "react";
import { UserContext } from "../pages/UserContext";
import { Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import { Styles } from "../styles/styles";
import routes from "./config";
import { UserProvider } from "../pages/UserContext"; // Import UserProvider
import { Navigate } from "react-router-dom";



// Lazy import components
const CourseGrades = lazy(() => import("../pages/CourseGrades"));
const LazyComponents: { [key: string]: React.LazyExoticComponent<any> } = {
  CourseGrades,
  // Add other lazy imports if needed
};

const Router = () => {
  const context = useContext(UserContext) as any;
  const userId = context?.userId;
  return (
    
      <Suspense fallback={null}>
        <Styles />
        {userId && <Header />}
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