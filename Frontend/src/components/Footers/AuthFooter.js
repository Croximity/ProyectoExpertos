
// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from "reactstrap";

const Login = () => {
  return (
    <>
          <footer className="footer bg-light p-5">
      <Row className="align-items-center justify-content-xl-between">
        <Col xl="6">
          <div className="copyright text-center text-xl-left text-default">
            © {new Date().getFullYear()}{" "}
            <a
              className="font-weight-bold ml-1 text-default"
              href="https://www.opticaVelasquez.com" // Reemplaza por el sitio oficial
              target="_blank"
              rel="noopener noreferrer"
            >
              Óptica Velásquez
            </a>{" "}
            - Todos los derechos reservados
          </div>
        </Col>

        <Col xl="6">
          <Nav className="nav-footer justify-content-center justify-content-xl-end">
            <NavItem>
              <NavLink
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-default"
              >
                Facebook
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                href="https://www.instagram.com/ÓpticaVelásquez"
                rel="noopener noreferrer"
                className="text-default"
              >
                Instagram
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                href="http://www.tiktok.com/@ÓpticaVelásquez" // Cambia por tu número real
                target="_blank"
                rel="noopener noreferrer"
                className="text-pdefault"
              >
                Tiktok
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="text-default"
              >
                Whatsapp
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                href="https://www.ÓpticaVelásquez.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-default"
              >
                Sitio Web
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
      </Row>
    </footer>
    </>
  );
};

export default Login;
