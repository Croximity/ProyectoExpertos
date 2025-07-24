
import { useState } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  ListGroup,
  ListGroupItem,
  Media,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  Collapse, // <--- ¡ESTO ES LO QUE FALTABA O SE HABÍA PERDIDO!
} from "reactstrap";

var ps;

const Sidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState();
  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };
  // verifies if routeName is reached.
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  // creates the links that appear in the left sidebar (and therefore in the navbar)
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      // Ignoramos las rutas que tienen `hidden: true` para que no aparezcan en el sidebar
      if (prop.hidden) {
        return null;
      }
      if (prop.layout === "/admin") {
        return (
          <NavItem key={key}>
            <NavLink
              to={prop.layout + prop.path}
              tag={NavLinkRRD}
              onClick={toggleCollapse}
              className={"pr-0 " + activeRoute(prop.layout + prop.path)}
            >
              <i className={prop.icon} />
              {prop.name}
            </NavLink>
          </NavItem>
        );
      } else {
        return null;
      }
    });
  };

  const { routes, logo } = props;
  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
      rel: "noopener noreferrer",
    };
  }

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/* Brand */}
        {logo ? (
          <NavbarBrand className="p-1" {...navbarBrandProps}>
          <img
            alt={logo.imgAlt}
            className="navbar-brand-img"
            src={logo.imgSrc}
            style={{ width: "auto", height: "200", important: "true"  }}
          />
          
          </NavbarBrand>
        ) : null}
        {/* User */}
        <Nav className="align-items-center d-md-none">
          {/* ... (código existente para el dropdown de usuario en móvil si lo tienes) */}
        </Nav>
        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}> {/* <--- Este Collapse necesita estar importado */}
          {/* Collapse header */}
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link to={logo.innerLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </a>
                  )}
                </Col>
              ) : null}
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          {/* Form */}
          <Form className="mt-4 mb-3 d-md-none">
            <InputGroup className="input-group-rounded input-group-merge">
              <Input
                aria-label="Search"
                className="form-control-rounded form-control-prepended"
                placeholder="Search"
                type="search"
              />
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <span className="fa fa-search" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Form>
          {/* Navigation */}
          <Nav className="navbar-nav">{createLinks(routes)}</Nav>
          {/* Divider */}
          <hr className="my-3" />
          {/* Heading */}
          <h6 className="navbar-heading text-muted">Configuraciones</h6>
          {/* Navigation */}
          <Nav className="mb-md-3">
            <NavItem> 
              <NavLink to="http://localhost:3000/admin/user-profile" tag={NavLinkRRD}>
                <i className="ni ni-single-02" />
                Perfil de Usuario
              </NavLink>
              <NavLink href="https://demos.creative-tim.com/argon-dashboard-react/#/documentation/alerts?ref=adr-sidebar">
                <i className="ni ni-ui-04" />
                Components
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that app's router knows about
    innerLink: PropTypes.string,
    // outterLink is for links that go outside the app
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the logo
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;