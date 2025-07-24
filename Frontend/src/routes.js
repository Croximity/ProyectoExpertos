
// Clientes
import Clientes from "views/gestion_cliente/Clientes.js";

import Index from "views/Index.js";
import Profile from "views/gestion_cliente/Profile.js";
import Maps from "views/gestion_cliente/Maps.js";
import Register from "views/gestion_cliente/Register.js";
import Login from "views/gestion_cliente/Login.js";



// Facturación
import PanelFacturacion from "views/facturacion/PanelFacturacion";
import CrearFactura from "views/facturacion/CrearFactura";
import HistorialFactura from "views/facturacion/HistorialFactura";
import Factura from "views/facturacion/Factura";
import RegistrarPago from "views/facturacion/RegistrarPago";
import CAI from "views/facturacion/Cai";
import Contratos from "views/facturacion/Contratos";
import Canjes from "views/facturacion/Canjes";
// Facturación - Crear Factura
import CrearFacturaNueva from "views/facturacion/CrearFacturaNueva";
import ListaFacturas from "views/facturacion/ListasFacturas.js";



const routes = [

 
  // Dashboard
  {
    path: "/index",
    name: "Panel de Control",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin",
  },

// Clientes
  {
  path: "/clientes",
  name: "Clientes",
  icon: "ni ni-single-02 text-primary",
  component: Clientes,
  layout: "/admin"
  },

  
  // Facturación
  {
    path: "/facturacion/panel",
    name: "Facturación",
    icon: "ni ni-collection text-blue",
    component: PanelFacturacion,
    layout: "/admin",
  },
  {  
    path: "/crear-factura-nueva",  
    name: "Nueva Factura",  
    icon: "ni ni-fat-add text-green",  
    component: CrearFacturaNueva,  
    layout: "/admin",  
  },
  {  
    path: "/facturas",  
    name: "Facturas",  
    icon: "ni ni-single-copy-04 text-pink",  
    component: ListaFacturas,  
    layout: "/admin",  
  }, 
  {
    path: "/facturacion/crear",
    name: "Crear Factura",
    icon: "ni ni-fat-add text-green",
    component: CrearFactura,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/facturacion/historial",
    name: "Historial Facturas",
    icon: "ni ni-time-alarm text-orange",
    component: HistorialFactura,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/facturacion/factura/:id",
    name: "Historial Facturas",
    icon: "ni ni-time-alarm text-orange",
    component: Factura,
    layout: "/admin",
    hidden: true,
  },  
    {
    path: "/facturacion/pagos",
    name: "Registrar Pago",
    icon: "ni ni-money-coins text-success",
    component: RegistrarPago,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/facturacion/cai",
    name: "Control CAI",
    icon: "ni ni-key-25 text-warning",
    component: CAI,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/facturacion/contratos",
    name: "Contratos",
    icon: "ni ni-briefcase-24 text-info",
    component: Contratos,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/facturacion/canjes",
    name: "Canjes",
    icon: "ni ni-basket text-danger",
    component: Canjes,
    layout: "/admin",
    hidden: true,
  },
  // Perfil de Usuario
    {
    path: "/user-profile",
    name: "Perfil de Usuario",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin",
    hidden: true,
  },
// Mapa
    {
    path: "/mapas",
    name: "Mapa",
    icon: "ni ni-pin-3 text-orange",
    component: Maps,
    layout: "/admin",
  },

  // Authentication Login/Register
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth",
  },
];

export default routes;


