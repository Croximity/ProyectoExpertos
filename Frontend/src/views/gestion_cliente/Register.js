// views/examples/Register.js  
import React, { useState } from 'react';  
import { useNavigate } from 'react-router-dom';  
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
  Row,  
  Col,  
  Alert  
} from "reactstrap";  
import { authService } from '../../services/authService';  
  
const Register = () => {  
  const [formData, setFormData] = useState({  
    Nombre_Usuario: '',  
    contraseña: '',  
    idPersona: 1, // Valor por defecto según tu modelo  
    idrol: 1 // Valor por defecto según tu modelo  
  });  
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState('');  
  const [success, setSuccess] = useState('');  
  const [acceptedTerms, setAcceptedTerms] = useState(false);  
  const navigate = useNavigate();  
  
  const handleChange = (e) => {  
    setFormData({  
      ...formData,  
      [e.target.name]: e.target.value  
    });  
  };  
  
  const handleSubmit = async (e) => {  
    e.preventDefault();  
    setLoading(true);  
    setError('');  
    setSuccess('');  
  
    if (!acceptedTerms) {  
      setError('Debes aceptar la Política de Privacidad');  
      setLoading(false);  
      return;  
    }  
  
    try {  
      const response = await authService.register(formData);  
      setSuccess('Usuario registrado exitosamente. Puedes iniciar sesión ahora.');  
        
      // Redirigir al login después de 2 segundos  
      setTimeout(() => {  
        navigate('/auth/login');  
      }, 2000);  
    } catch (error) {  
      setError(error.message);  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  return (  
    <>  
      <Col lg="6" md="8">  
        <Card className="bg-secondary shadow border-0">  
          <CardHeader className="bg-transparent pb-5">  
            <div className="text-muted text-center mt-2 mb-4">  
              <small>Registrarse con</small>  
            </div>  
            <div className="text-center">  
              <Button  
                className="btn-neutral btn-icon mr-4"  
                color="default"  
                href="#pablo"  
                onClick={(e) => e.preventDefault()}  
              >  
                <span className="btn-inner--icon">  
                  <img  
                    alt="..."  
                    src={require("../../assets/img/icons/common/github.svg").default}  
                  />  
                </span>  
                <span className="btn-inner--text">Github</span>  
              </Button>  
              <Button  
                className="btn-neutral btn-icon"  
                color="default"  
                href="#pablo"  
                onClick={(e) => e.preventDefault()}  
              >  
                <span className="btn-inner--icon">  
                  <img  
                    alt="..."  
                    src={require("../../assets/img/icons/common/google.svg").default}  
                  />  
                </span>  
                <span className="btn-inner--text">Google</span>  
              </Button>  
            </div>  
          </CardHeader>  
          <CardBody className="px-lg-5 py-lg-5">  
            <div className="text-center text-muted mb-4">  
              <small>O crea una cuenta con tus datos</small>  
            </div>  
  
            {error && (  
              <Alert color="danger">  
                {error}  
              </Alert>  
            )}  
  
            {success && (  
              <Alert color="success">  
                {success}  
              </Alert>  
            )}  
  
            <Form role="form" onSubmit={handleSubmit}>  
              <FormGroup>  
                <InputGroup className="input-group-alternative mb-3">  
                  <InputGroupAddon addonType="prepend">  
                    <InputGroupText>  
                      <i className="ni ni-single-02" />  
                    </InputGroupText>  
                  </InputGroupAddon>  
                  <Input   
                    placeholder="Nombre de usuario"   
                    type="text"  
                    name="Nombre_Usuario"  
                    value={formData.Nombre_Usuario}  
                    onChange={handleChange}  
                    required  
                  />  
                </InputGroup>  
              </FormGroup>  
              <FormGroup>  
                <InputGroup className="input-group-alternative">  
                  <InputGroupAddon addonType="prepend">  
                    <InputGroupText>  
                      <i className="ni ni-lock-circle-open" />  
                    </InputGroupText>  
                  </InputGroupAddon>  
                  <Input  
                    placeholder="Contraseña (mínimo 6 caracteres)"  
                    type="password"  
                    name="contraseña"  
                    value={formData.contraseña}  
                    onChange={handleChange}  
                    minLength="6"  
                    autoComplete="new-password"  
                    required  
                  />  
                </InputGroup>  
              </FormGroup>  
              <div className="text-muted font-italic">  
                <small>  
                  Seguridad de la contraseña:{" "}  
                  <span className="text-success font-weight-700">  
                    {formData.contraseña.length >= 6 ? 'fuerte' : 'débil'}  
                  </span>  
                </small>  
              </div>  
              <Row className="my-4">  
                <Col xs="12">  
                  <div className="custom-control custom-control-alternative custom-checkbox">  
                    <input  
                      className="custom-control-input"  
                      id="customCheckRegister"  
                      type="checkbox"  
                      checked={acceptedTerms}  
                      onChange={(e) => setAcceptedTerms(e.target.checked)}  
                      required  
                    />  
                    <label  
                      className="custom-control-label"  
                      htmlFor="customCheckRegister"  
                    >  
                      <span className="text-muted">  
                        Acepto la{" "}  
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>  
                          Política de Privacidad  
                        </a>  
                      </span>  
                    </label>  
                  </div>  
                </Col>  
              </Row>  
              <div className="text-center">  
                <Button   
                  className="mt-4"   
                  color="primary"   
                  type="submit"  
                  disabled={loading}  
                >  
                  {loading ? 'Creando cuenta...' : 'Crear cuenta'}  
                </Button>  
              </div>  
            </Form>  
          </CardBody>  
        </Card>  
        <Row className="mt-3">  
          <Col className="text-center">  
            <a  
              className="text-light"  
              href="#pablo"  
              onClick={(e) => navigate('/auth/login')}  
            >  
              <small>¿Ya tienes cuenta? Inicia sesión</small>  
            </a>  
          </Col>  
        </Row>  
      </Col>  
    </>  
  );  
};  
  
export default Register;