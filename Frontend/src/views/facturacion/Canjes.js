import React, { useState } from "react";
import {
  Card, CardBody, CardHeader,
  Container, Row, Col,
  Table, Button, FormGroup, Label, Input, Form
} from "reactstrap";
import HeaderResponsive from "components/Headers/HeaderResponsive";

const GestionCanjes = () => {
  const [canjes, setCanjes] = useState([]);
  const [nuevoCanje, setNuevoCanje] = useState({
    empresa: "",
    descripcion: "",
    isv: false,
    activo: true,
    fechaInicio: "",
    fechaFin: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNuevoCanje({
      ...nuevoCanje,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const agregarCanje = () => {
    if (!nuevoCanje.empresa || !nuevoCanje.descripcion) {
      alert("Empresa y descripción son requeridas.");
      return;
    }
    setCanjes([...canjes, { ...nuevoCanje }]);
    setNuevoCanje({
      empresa: "",
      descripcion: "",
      isv: false,
      activo: true,
      fechaInicio: "",
      fechaFin: ""
    });
  };

  return (
    <>
      <HeaderResponsive />
      <Container className="mt-4">
        <Card>
          <CardHeader><h4>Gestión de Canjes</h4></CardHeader>
          <CardBody>
            <Form>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label>Empresa</Label>
                    <Input
                      name="empresa"
                      value={nuevoCanje.empresa}
                      onChange={handleChange}
                      placeholder="Nombre de la empresa"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Descripción</Label>
                    <Input
                      name="descripcion"
                      value={nuevoCanje.descripcion}
                      onChange={handleChange}
                      placeholder="Descripción del canje"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={4}>
                  <FormGroup>
                    <Label>Fecha de inicio</Label>
                    <Input
                      type="date"
                      name="fechaInicio"
                      value={nuevoCanje.fechaInicio}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label>Fecha de fin</Label>
                    <Input
                      type="date"
                      name="fechaFin"
                      value={nuevoCanje.fechaFin}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup check className="mt-4">
                    <Label check>
                      <Input
                        type="checkbox"
                        name="isv"
                        checked={nuevoCanje.isv}
                        onChange={handleChange}
                      />
                      Aplica 15% ISV
                    </Label>
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup check className="mt-4">
                    <Label check>
                      <Input
                        type="checkbox"
                        name="activo"
                        checked={nuevoCanje.activo}
                        onChange={handleChange}
                      />
                      Activo
                    </Label>
                  </FormGroup>
                </Col>
              </Row>
              <Button color="primary" onClick={agregarCanje}>Guardar Canje</Button>
            </Form>

            <hr />
            <h5 className="mt-4">Lista de Canjes</h5>
            <Table responsive striped>
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Descripción</th>
                  <th>ISV</th>
                  <th>Activo</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                </tr>
              </thead>
              <tbody>
                {canjes.map((c, i) => (
                  <tr key={i}>
                    <td>{c.empresa}</td>
                    <td>{c.descripcion}</td>
                    <td>{c.isv ? "Sí" : "No"}</td>
                    <td>{c.activo ? "Sí" : "No"}</td>
                    <td>{c.fechaInicio}</td>
                    <td>{c.fechaFin}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default GestionCanjes;
