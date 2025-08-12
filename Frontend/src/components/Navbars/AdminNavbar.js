
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";
import { useAuth } from "../../contexts/AuthContext";

const AdminNavbar = (props) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  // Función para obtener el nombre completo del usuario
  const getUserDisplayName = () => {
    if (!user) return 'Usuario';
    
    // Si tiene persona asociada, mostrar nombre completo
    if (user.persona) {
      const { Pnombre, Snombre, Papellido, Sapellido } = user.persona;
      const nombres = [Pnombre, Snombre].filter(Boolean).join(' ');
      const apellidos = [Papellido, Sapellido].filter(Boolean).join(' ');
      return `${nombres} ${apellidos}`.trim() || user.Nombre_Usuario || 'Usuario';
    }
    
    // Si no tiene persona pero tiene Nombre_Usuario
    if (user.Nombre_Usuario) {
      return user.Nombre_Usuario;
    }
    
    // Si no tiene persona pero tiene idPersona, intentar obtener el nombre
    if (user.idPersona) {
      return `Usuario ${user.idPersona}`;
    }
    
    return 'Usuario';
  };

  // Función para obtener el rol del usuario
  const getUserRole = () => {
    if (!user) return '';
    
    if (user.rol) {
      return user.rol.Nombre || user.rol.nombre || '';
    }
    
    if (user.idrol) {
      // Mapear IDs de rol a nombres (ajustar según tu sistema)
      const roleNames = {
        1: 'Administrador',
        2: 'Usuario',
        3: 'Vendedor'
      };
      return roleNames[user.idrol] || `Rol ${user.idrol}`;
    }
    
    return '';
  };

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          
          <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup className="mb-0">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input placeholder="Buscar..." type="text" />
              </InputGroup>
            </FormGroup>
          </Form>
          
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="Avatar del usuario"
                      src={require("../../assets/img/theme/team-4-800x800.jpg")}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold text-white">
                      {getUserDisplayName()}
                    </span>
                    {getUserRole() && (
                      <small className="text-white-50 d-block">
                        {getUserRole()}
                      </small>
                    )}
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu 
                className="dropdown-menu-arrow" 
                right 
                style={{ 
                  zIndex: 9999,
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  minWidth: '250px'
                }}
              >
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">
                    ¡Hola, {getUserDisplayName().split(' ')[0]}!
                  </h6>
                  {getUserRole() && (
                    <small className="text-muted">{getUserRole()}</small>
                  )}
                </DropdownItem>
                
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>Mi perfil</span>
                </DropdownItem>
                
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-settings-gear-65" />
                  <span>Configuraciones</span>
                </DropdownItem>
                
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-calendar-grid-58" />
                  <span>Actividad</span>
                </DropdownItem>
                
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-support-16" />
                  <span>Ayuda</span>
                </DropdownItem>
                
                <DropdownItem divider />
                
                <DropdownItem onClick={handleLogout}>
                  <i className="ni ni-user-run" />
                  <span>Cerrar Sesión</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
