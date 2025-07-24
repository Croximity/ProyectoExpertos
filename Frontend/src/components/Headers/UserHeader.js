// reactstrap components
import { Button, Container, Row, Col } from "reactstrap";

const UserHeader = () => {
  return (
    <>
      <div
        className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
          minHeight: "200px",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Mask */}
        <span className="mask bg-gradient-default opacity-8" />
        {/* Header container */}
        <Container className="d-flex align-items-center" fluid>
              <Row>
                <Col md="12" className="d-flex gap-2">
                  <Button color="success" onClick={() => console.log("Crear")}>
                    Crear
                  </Button>

                  <Button color="primary" onClick={() => console.log("Leer")}>
                    Mostrar
                  </Button>

                  <Button color="info" onClick={() => console.log("Editar")}>
                    Editar
                  </Button>

                  <Button color="danger" onClick={() => console.log("Eliminar")}>
                    Eliminar
                  </Button>
                </Col>
              </Row>
            </Container>
      </div>
    </>
  );
};

export default UserHeader;
