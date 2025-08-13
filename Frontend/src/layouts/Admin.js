import React, { useState, useEffect } from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import ProtectedRoute from "components/ProtectedRoute.js";
import RoleProtectedRoute from "components/RoleProtectedRoute.js";

import routes from "routes.js";

const Admin = () => {
  const location = useLocation();
  const mainContentRef = React.useRef(null);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        const Component = prop.component;
        // Check if component is properly imported
        if (Component && typeof Component === 'function') {
          const element = prop.allowedRoles ? (
            <RoleProtectedRoute allowedRoles={prop.allowedRoles}>
              <Component />
            </RoleProtectedRoute>
          ) : (
            <Component />
          );
          return <Route path={prop.path} element={element} key={key} />;
        } else {
          console.error(`Component for route ${prop.path} is not properly imported`);
          return null;
        }
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        path.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <ProtectedRoute>
      <Sidebar
        location={location}
        routes={routes}
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/logoOptica.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContentRef}>
        <AdminNavbar
          location={location}
          brandText={getBrandText(location.pathname)}
        />
        <Routes>{getRoutes(routes)}</Routes>
        <AdminFooter />
      </div>
    </ProtectedRoute>
  );
};

export default Admin;