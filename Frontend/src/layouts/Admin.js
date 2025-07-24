import React, { useState, useEffect } from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";



const Admin = () => {
  const location = useLocation();
  const mainContentRef = React.useRef(null);
  // CAMBIO CLAVE: Estructura de datos de inventario con historial de mantenimiento
  const [inventoryData, setInventoryData] = useState([
    {
      id: "1",
      codigo: "ACT001",
      nombre: "Laptop Dell XPS",
      cantidad: 10,
      categoria: "Electrónica",
      estado: "Disponible",
      ubicacion: "Oficina 1",
      fechaAdquisicion: "2023-01-15",
      valor: 1200,
      mantenimientoHistory: [], // NUEVO: Historial de mantenimiento (array de objetos)
      proximoMantenimiento: "2025-07-15" // NUEVO: Próxima fecha de mantenimiento
    },
    {
      id: "2",
      codigo: "ACT002",
      nombre: "Monitor HP 24 pulgadas",
      cantidad: 25,
      categoria: "Electrónica",
      estado: "Disponible",
      ubicacion: "Oficina 2",
      fechaAdquisicion: "2023-02-01",
      valor: 250,
      mantenimientoHistory: [
        { fecha: "2024-06-01", descripcion: "Limpieza general y revisión", costo: 50, proximoMantenimiento: "2025-08-01" }
      ],
      proximoMantenimiento: "2025-08-01" // Se actualiza con la última fecha registrada
    },
    {
      id: "3",
      codigo: "ACT003",
      nombre: "Impresora Laserjet",
      cantidad: 5,
      categoria: "Oficina",
      estado: "Mantenimiento",
      ubicacion: "Almacén",
      fechaAdquisicion: "2022-11-20",
      valor: 400,
      mantenimientoHistory: [
        { fecha: "2024-01-10", descripcion: "Cambio de tóner", costo: 80 },
        { fecha: "2024-05-15", descripcion: "Reparación de bandeja", costo: 120, proximoMantenimiento: "2025-09-01" }
      ],
      proximoMantenimiento: "2025-09-01"
    },
    {
      id: "4",
      codigo: "ACT004",
      nombre: "Teclado Mecánico",
      cantidad: 50,
      categoria: "Periféricos",
      estado: "Disponible",
      ubicacion: "Oficina 1",
      fechaAdquisicion: "2024-03-10",
      valor: 80,
      mantenimientoHistory: [],
      proximoMantenimiento: "N/A"
    },
    {
      id: "5",
      codigo: "ACT005",
      nombre: "Mouse Inalámbrico",
      cantidad: 75,
      categoria: "Periféricos",
      estado: "Disponible",
      ubicacion: "Oficina 2",
      fechaAdquisicion: "2024-03-10",
      valor: 30,
      mantenimientoHistory: [],
      proximoMantenimiento: "N/A"
    },
  ]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContentRef.current.scrollTop = 0;
  }, [location]);

  const addActivo = (newActivo) => {
    // Asegurarse de que los nuevos activos también tengan estos campos
    setInventoryData((prevData) => [...prevData, { ...newActivo, mantenimientoHistory: [], proximoMantenimiento: "N/A" }]);
  };

  const updateStock = (assetId, newQuantity) => {
    setInventoryData((prevData) =>
      prevData.map((asset) =>
        asset.id === assetId ? { ...asset, cantidad: newQuantity } : asset
      )
    );
  };

  // NUEVA FUNCIÓN: Para añadir un registro de mantenimiento al historial
  const addMantenimientoRecord = (assetId, record) => {
    setInventoryData((prevData) =>
      prevData.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              mantenimientoHistory: [...(asset.mantenimientoHistory || []), record],
              // Opcional: actualizar proximoMantenimiento si el registro incluye una fecha futura
              proximoMantenimiento: record.proximoMantenimiento || asset.proximoMantenimiento
            }
          : asset
      )
    );
  };

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
          if (prop.path === "/inventario") {
          return (
            <Route
              path={prop.path}
              element={<prop.component addActivo={addActivo} />}
              key={key}
            />
          );
        }
        if (prop.path === "/gestionar-stock") {
            return (
                <Route
                    path={prop.path}
                    element={<prop.component inventoryData={inventoryData} updateStock={updateStock} />}
                    key={key}
                />
            );
        }
        if (prop.path === "/lista-activos") {
          return (
            <Route
              path={prop.path}
              element={<prop.component inventoryData={inventoryData} />}
              key={key}
            />
          );
        }
        // NUEVA RUTA: Pasar inventoryData y la función addMantenimientoRecord a GestionarMantenimiento
        if (prop.path === "/gestionar-mantenimiento") {
            return (
                <Route
                    path={prop.path}
                    element={<prop.component inventoryData={inventoryData} addMantenimientoRecord={addMantenimientoRecord} />}
                    key={key}
                />
            );
        }
        if (prop.path === "/generar-reportes") {
          return (
            <Route
                path={prop.path}
                element={<prop.component inventoryData={inventoryData}/>}
                key={key}
                />
          );
        }
        return (
          <Route path={prop.path} element={<prop.component />} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        path.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <Sidebar
        location={location}
        routes={routes}
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/logoCanal.png"),
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
    </>
  );
};

export default Admin;