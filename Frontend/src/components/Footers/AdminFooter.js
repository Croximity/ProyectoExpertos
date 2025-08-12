/*eslint-disable*/
// reactstrap components
import { Row, Col, Nav, NavItem, NavLink } from "reactstrap";

const AdminFooter = () => {
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
              Óptica Velasquez 
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
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-default"
              >
                Instagram
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                href="http://www.tiktok.com/" // Cambia por tu número real
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
                href=""
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

export default AdminFooter;
