import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import { Styles } from "../styles/styles";
import routes from "./config";
import { UserProvider } from "../pages/UserContext"; // Import UserProvider

// Lazy import components
const CourseGrades = lazy(() => import("../pages/CourseGrades"));
const LazyComponents: { [key: string]: React.LazyExoticComponent<any> } = {
  CourseGrades,
  // Add other lazy imports if needed
};

const Router = () => {
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