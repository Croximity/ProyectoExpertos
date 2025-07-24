import React from "react";

// reactstrap components
import { Card, Container, Row } from "reactstrap";

// core components
import Header from "components/Headers/Header.js";

const Maps = () => {
  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow border-0 p-3">
              <h3 className="mb-4">Ubicación de Canal 40</h3>
              <div className="map-responsive">
                <iframe
                  title="Mapa Canal 40"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3863.7671693870534!2d-87.63783592581943!3d14.440577280976328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f6585ebb21e9909%3A0xc41883de59ec77c0!2sComayagua%20Television%20Canal%2040!5e0!3m2!1ses-419!2shn!4v1752467835483!5m2!1ses-419!2shn"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Maps;
