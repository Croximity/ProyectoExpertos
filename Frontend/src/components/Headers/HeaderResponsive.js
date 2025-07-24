import React from "react";
import { Container, Row, Col } from "reactstrap";

const HeaderResponsive = () => {
  return (
    <div className="header bg-gradient-primary py-2 mb-4" style={{ minHeight: "76px" }}>
      <Container fluid>
        <Row className="align-items-center">
          <Col xs="12" sm="6">
          </Col>
          <Col className="text-sm-right mt-2 mt-sm-0" xs="12" sm="6">
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HeaderResponsive;
