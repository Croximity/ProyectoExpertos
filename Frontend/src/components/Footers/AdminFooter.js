/*eslint-disable*/
// reactstrap components
import { Row, Col, Nav, NavItem, NavLink } from "reactstrap";

const Footer = () => {
  return (
    <footer className="footer bg-light p-5 mt-5">
      <Row className="align-items-center justify-content-xl-between">
        <Col xl="6">
          <div className="copyright text-center text-xl-left text-default">
            © {new Date().getFullYear()}{" "}
            <a
              className="font-weight-bold ml-1 text-default"
              href="https://www.canal40.com" // Reemplaza por el sitio oficial
              target="_blank"
              rel="noopener noreferrer"
            >
              Canal 40
            </a>{" "}
            - Todos los derechos reservados
          </div>
        </Col>

        <Col xl="6">
          <Nav className="nav-footer justify-content-center justify-content-xl-end">
            <NavItem>
              <NavLink
                href="https://www.facebook.com/profile.php?id=100079642344803"
                target="_blank"
                rel="noopener noreferrer"
                className="text-default"
              >
                Facebook
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                href="https://www.instagram.com/television_comayagua?igsh=amo0YzV2MTRvbW5t"
                target="_blank"
                rel="noopener noreferrer"
                className="text-default"
              >
                Instagram
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                href="http://www.tiktok.com/@canal40comayagua" // Cambia por tu número real
                target="_blank"
                rel="noopener noreferrer"
                className="text-pdefault"
              >
                Tiktok
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                href="https://wa.me/50489871034?text=Hola,%20Canal%2040,%20me%20interesa%20sus%20servicios."
                target="_blank"
                rel="noopener noreferrer"
                className="text-default"
              >
                Whatsapp
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                href="https://www.televisioncomayagua.com"
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
  );
};

export default Footer;
