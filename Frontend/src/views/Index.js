// Dashboard mejorado para Canal 40
import { useState } from "react";
import classnames from "classnames";
import { Line, Bar } from "react-chartjs-2";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";
import Header from "components/Headers/Header.js";

const Index = () => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  const facturas = [
    { numero: "000001", cliente: "Mass Publicidad", fecha: "2025-05-01", total: 18400 },
    { numero: "000002", cliente: "Comercial Santa Fe", fecha: "2025-05-03", total: 12000 },
    { numero: "000003", cliente: "Clínica San Juan", fecha: "2025-05-05", total: 15000 },
  ];

  const resumenMensual = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Ingresos mensuales (L)",
        data: [10000, 12000, 18000, 15000, 22000, 17000, 25000],
        borderColor: "#5e72e4",
        fill: false,
      },
    ],
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        {/* Resumen de estadísticas */}
        <Row className="mb-4">
          <Col lg="3" md="6">
            <Card className="card-stats mb-4 mb-xl-0">
              <CardBody>
                <Row>
                  <Col>
                    <h5 className="card-title text-uppercase text-muted mb-0">Facturas</h5>
                    <span className="h2 font-weight-bold mb-0">{facturas.length}</span>
                  </Col>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                      <i className="ni ni-collection" />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" md="6">
            <Card className="card-stats mb-4 mb-xl-0">
              <CardBody>
                <Row>
                  <Col>
                    <h5 className="card-title text-uppercase text-muted mb-0">Ingresos</h5>
                    <span className="h2 font-weight-bold mb-0">L 45,400</span>
                  </Col>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                      <i className="ni ni-money-coins" />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Gráfico de Ingresos */}
        <Row className="mt-4">
          <Col xl="8">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Ingresos mensuales</h3>
              </CardHeader>
              <CardBody>
                <div className="chart">
                  <Line data={resumenMensual} />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Tabla de facturas */}
        <Row className="mt-5">
          <Col xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Facturas recientes</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Número</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {facturas.map((factura, index) => (
                    <tr key={index}>
                      <td>{factura.numero}</td>
                      <td>{factura.cliente}</td>
                      <td>{factura.fecha}</td>
                      <td>L {factura.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>

          {/* Tabla de tráfico social */}
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Interacciones en redes sociales</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Red</th>
                    <th scope="col">Visitas</th>
                    <th scope="col">%</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Facebook</th>
                    <td>1,480</td>
                    <td>
                      <Progress max="100" value="60" barClassName="bg-gradient-danger" />
                      <span>60%</span>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Instagram</th>
                    <td>3,678</td>
                    <td>
                      <Progress max="100" value="75" barClassName="bg-gradient-info" />
                      <span>75%</span>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Google</th>
                    <td>4,807</td>
                    <td>
                      <Progress max="100" value="80" barClassName="bg-gradient-success" />
                      <span>80%</span>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Twitter</th>
                    <td>2,645</td>
                    <td>
                      <Progress max="100" value="30" barClassName="bg-gradient-warning" />
                      <span>30%</span>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;