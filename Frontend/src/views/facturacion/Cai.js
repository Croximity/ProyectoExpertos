import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import HeaderResponsive from "components/Headers/HeaderResponsive";

const CAI = () => {
  const [caiData, setCaiData] = useState({
    cai: "254F8-612F1-8A0E0-6E8B3-0099B876",
    facturaNo: "000-001-01-000-02312",
    fechaEmision: "2025-05-01",
    cliente: "Televisión Canal 40 ",
    rtn: "08019995317907",
    periodoInicio: "2025-05-01",
    periodoFin: "2025-05-30",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCaiData({ ...caiData, [name]: value });
  };

  const generarTextoPeriodo = () => {
    const inicio = new Date(caiData.periodoInicio);
    const fin = new Date(caiData.periodoFin);

    const opciones = { day: "2-digit", month: "long", year: "numeric" };
    const inicioTexto = inicio.toLocaleDateString("es-HN", opciones);
    const finTexto = fin.toLocaleDateString("es-HN", opciones);

    return `Del ${inicioTexto} al ${finTexto}`;
  };

  const guardarDatos = () => {
    const periodo = generarTextoPeriodo();
    const datosFinales = { ...caiData, periodoTexto: periodo };

    console.log("Datos CAI guardados:", datosFinales);
    alert("Datos del CAI actualizados correctamente.");
    // Puedes guardar en localStorage si lo deseas
  };

  return (
    <>
      <HeaderResponsive />
      <Container className="mt-4" fluid>
        <Card className="shadow">
          <CardHeader>
            <h3 className="mb-0">Configuración de Datos CAI - SAR Honduras</h3>
          </CardHeader>
          <CardBody>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label>CAI</Label>
                  <Input name="cai" value={caiData.cai} onChange={handleChange} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Factura No.</Label>
                  <Input
                    name="facturaNo"
                    value={caiData.facturaNo}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label>Fecha de Emisión</Label>
                  <Input
                    type="date"
                    name="fechaEmision"
                    value={caiData.fechaEmision}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>

              <Col md={3}>
                <FormGroup>
                  <Label>Período Inicio</Label>
                  <Input
                    type="date"
                    name="periodoInicio"
                    value={caiData.periodoInicio}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>

              <Col md={3}>
                <FormGroup>
                  <Label>Período Fin</Label>
                  <Input
                    type="date"
                    name="periodoFin"
                    value={caiData.periodoFin}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>

            <hr />
            <h5 className="text-muted mb-3">Datos de la Empresa por Defecto</h5>

            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label>Nombre Empresa</Label>
                  <Input
                    name="cliente"
                    value={caiData.cliente}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>RTN</Label>
                  <Input
                    name="rtn"
                    value={caiData.rtn}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>


            <Button color="primary" onClick={guardarDatos}>
              Guardar Datos CAI
            </Button>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default CAI;
