

// Dashboard
import Index from "views/Index.js";

// Mapa
import Maps from "views/Maps.js";

// seguridad
import Profile from "views/seguridad/Profile.js";
import Register from "views/seguridad/Register.js";
import Login from "views/seguridad/Login.js";
import Personas from "views/seguridad/Personas.js";
import PersonaForm from "views/seguridad/PersonaForm.js";
import AsociarPersona from "views/seguridad/AsociarPersona.js";

// Gestion Clientes
import Clientes from "views/gestion_cliente/Clientes.js";
import ClienteForm from "views/gestion_cliente/ClienteForm.js";
import Empleados from "views/gestion_cliente/Empleados.js";
import EmpleadoForm from "views/gestion_cliente/EmpleadoForm.js";
import PanelGestionCliente from "views/gestion_cliente/PanelGestionCliente.js";


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

// Productos
import Productos from "views/productos/Productos.js";
import ProductoForm from "views/productos/ProductoForm.js";
import Categorias from "views/productos/Categorias.js";
import CategoriaForm from "views/productos/CategoriaForm.js";



const routes = [

 
  // Dashboard
  {
    path: "/index",
    name: "Panel de Control",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin", 
  },

// Gestion Clientes
  {
    path: "/gestion-cliente",
    name: "Panel de Gestión",
    icon: "ni ni-single-02 text-primary",
    component: PanelGestionCliente,
    layout: "/admin"
  },
  {
  path: "/clientes",
  name: "Lista de Clientes",
  icon: "ni ni-single-02 text-primary",
  component: Clientes,
  layout: "/admin"
  },
  {
    path: "/clientes/nuevo",
    name: "Nuevo Cliente",
    component: ClienteForm,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/clientes/editar/:id",
    name: "Editar Cliente",
    component: ClienteForm,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/empleados",
    name: "Lista de Empleados",
    icon: "ni ni-badge text-success",
    component: Empleados,
    layout: "/admin",
  },
  {
    path: "/empleados/nuevo",
    name: "Nuevo Empleado",
    component: EmpleadoForm,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/empleados/editar/:id",
    name: "Editar Empleado",
    component: EmpleadoForm,
    layout: "/admin",
    hidden: true,
  },

  // Productos
  {
    path: "/productos",
    name: "Productos",
    icon: "ni ni-shop text-info",
    component: Productos,
    layout: "/admin",
  },
  {
    path: "/productos/nuevo",
    name: "Nuevo Producto",
    component: ProductoForm,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/productos/editar/:id",
    name: "Editar Producto",
    component: ProductoForm,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/categorias",
    name: "Categorías",
    icon: "ni ni-tag text-warning",
    component: Categorias,
    layout: "/admin",
  },
  {
    path: "/categorias/nueva",
    name: "Nueva Categoría",
    component: CategoriaForm,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/categorias/editar/:id",
    name: "Editar Categoría",
    component: CategoriaForm,
    layout: "/admin",
    hidden: true,
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

  // Seguridad - Gestión de Personas
  {
    path: "/personas",
    name: "Personas",
    icon: "ni ni-circle-08 text-info",
    component: Personas,
    layout: "/admin",
  },
  {
    path: "/personas/nueva",
    name: "Nueva Persona",
    component: PersonaForm,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/personas/editar/:id",
    name: "Editar Persona",
    component: PersonaForm,
    layout: "/admin",
    hidden: true,
  },
  {
    path: "/asociar-persona",
    name: "Asociar Personas",
    icon: "ni ni-link text-warning",
    component: AsociarPersona,
    layout: "/admin",
  },

  // ------------------- Parte----------------------------
  // Perfil de Usuario
    {
    path: "/user-profile",
    name: "Perfil de Usuario",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin",
    hidden: true,
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
  // Mapa
    {
    path: "/mapas",
    name: "Mapa",
    icon: "ni ni-pin-3 text-orange",
    component: Maps,
    layout: "/admin",
  },

];

export default routes;


