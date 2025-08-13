const { body, validationResult } = require('express-validator');
const Cliente = require('../../modelos/gestion_cliente/Cliente');
const Persona = require('../../modelos/seguridad/Persona');
const { Op } = require('sequelize');

// === VALIDACIONES ===
const reglasCrear = [
  body('idPersona')
    .notEmpty().withMessage('El idPersona es obligatorio')
    .isInt().withMessage('El idPersona debe ser un número entero'),
  body('fechaRegistro')
    .optional()
    .isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)')
];

const reglasEditar = [
  body('idPersona')
    .optional()
    .isInt().withMessage('El idPersona debe ser un número entero'),
  body('fechaRegistro')
    .optional()
    .isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)')
];

// === CONTROLADORES ===

// Crear cliente
const enviarCorreo = require('../../configuraciones/correo').EnviarCorreo;
const crearCliente = [
  ...reglasCrear,
  async (req, res) => {
    const errores = validationResult(req)
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() })
    }
    try {
      const cliente = await Cliente.create(req.body)
      // Buscar el correo de la persona asociada
      const persona = await Persona.findByPk(req.body.idPersona)
      if (persona && persona.correo) {
        // Enviar correo con HTML bonito
        const adminCorreo = process.env.correousuario || "admin@optica.com"
        await enviarCorreo({
          para: persona.correo,
          asunto: "¡Bienvenido a Óptica Expertos!",
          descripcion: `Hola ${persona.Pnombre}, su registro como cliente fue exitoso por el administrador (${adminCorreo}).`,
          html: `
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Bienvenido a Óptica Expertos</title>
              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
              <div style="padding: 40px 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden;">
                  
                  <!-- Header simplificado -->
                  <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 30px; text-align: center; position: relative;">
                    <div style="position: relative; z-index: 1;">
                      <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0 0 10px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">👓 Óptica Expertos</h1>
                      <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 0; font-weight: 300;">Tu visión, nuestra pasión</p>
                    </div>
                  </div>

                  <!-- Contenido principal -->
                  <div style="padding: 40px 30px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                      <div style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; padding: 15px; margin-bottom: 20px;">
                        <span style="color: white; font-size: 24px;">✓</span>
                      </div>
                      <h2 style="color: #1f2937; font-size: 28px; font-weight: 600; margin: 0 0 15px 0;">¡Bienvenido, ${persona.Pnombre}!</h2>
                      <p style="color: #6b7280; font-size: 18px; line-height: 1.6; margin: 0;">Tu registro como cliente ha sido completado exitosamente</p>
                    </div>

                    <!-- Características del servicio -->
                    <div style="background: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0;">
                      <h3 style="color: #374151; font-size: 20px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">¿Qué puedes esperar de nosotros?</h3>
                      <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
                        <div style="flex: 1; min-width: 200px; text-align: center;">
                          <div style="background: #dbeafe; border-radius: 8px; padding: 12px; display: inline-block; margin-bottom: 10px;">
                            <span style="color: #3b82f6; font-size: 20px;">👁️</span>
                          </div>
                          <h4 style="color: #374151; font-size: 16px; font-weight: 500; margin: 0 0 5px 0;">Exámenes Profesionales</h4>
                          <p style="color: #6b7280; font-size: 14px; margin: 0;">Tecnología de vanguardia</p>
                        </div>
                        <div style="flex: 1; min-width: 200px; text-align: center;">
                          <div style="background: #dcfce7; border-radius: 8px; padding: 12px; display: inline-block; margin-bottom: 10px;">
                            <span style="color: #10b981; font-size: 20px;">⭐</span>
                          </div>
                          <h4 style="color: #374151; font-size: 16px; font-weight: 500; margin: 0 0 5px 0;">Calidad Premium</h4>
                          <p style="color: #6b7280; font-size: 14px; margin: 0;">Marcas reconocidas</p>
                        </div>
                      </div>
                    </div>

                    <!-- Call to action -->
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="tel:+1234567890" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
                        📞 Agenda tu Cita
                      </a>
                    </div>

                    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 0 8px 8px 0; margin: 25px 0;">
                      <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: 500;">
                        💡 <strong>Tip:</strong> Recuerda traer tu receta médica actual para un mejor servicio personalizado.
                      </p>
                    </div>
                  </div>

                  <!-- Footer -->
                  <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <div style="margin-bottom: 20px;">
                      <h4 style="color: #374151; font-size: 16px; font-weight: 600; margin: 0 0 10px 0;">Información de Contacto</h4>
                      <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">📧 Administrador: <strong>${adminCorreo}</strong></p>
                      <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">📍 Dirección: Av. Principal 123, Ciudad</p>
                      <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">🕒 Horarios: Lun-Vie 9:00-18:00, Sáb 9:00-14:00</p>
                    </div>
                    
                    <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
                      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                        © 2024 Óptica Expertos. Todos los derechos reservados.<br>
                        Este correo fue enviado porque te registraste como cliente en nuestro sistema.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </body>
            </html>
          `,
        })
      }
      res.status(201).json({ mensaje: "Cliente creado", cliente })
    } catch (error) {
      res.status(500).json({ mensaje: "Error al crear cliente", error: error.message })
    }
  },
];

// Obtener todos los clientes con búsqueda por nombre/apellido/correo/DNI de Persona
const obtenerClientes = async (req, res) => {
  try {
    const { Pnombre, Papellido, correo, DNI } = req.query;
    console.log('Filtros recibidos en backend:', { Pnombre, Papellido, correo, DNI });
    
    let whereClause = {};
    
    // Si se proporcionan filtros, construir la consulta
    if ((Pnombre && Pnombre.trim()) || (Papellido && Papellido.trim()) || (correo && correo.trim()) || (DNI && DNI.trim())) {
      whereClause = {
        include: [{
          model: Persona,
          as: 'persona',
          where: {
            [Op.or]: []
          }
        }]
      };
      
      // Agregar filtros de nombre
      if (Pnombre && Pnombre.trim()) {
        whereClause.include[0].where[Op.or].push(
          { Pnombre: { [Op.like]: `%${Pnombre.trim()}%` } },
          { Snombre: { [Op.like]: `%${Pnombre.trim()}%` } }
        );
      }
      
      // Agregar filtros de apellido
      if (Papellido && Papellido.trim()) {
        whereClause.include[0].where[Op.or].push(
          { Papellido: { [Op.like]: `%${Papellido.trim()}%` } },
          { Sapellido: { [Op.like]: `%${Papellido.trim()}%` } }
        );
      }
      
      // Agregar filtro de correo
      if (correo && correo.trim()) {
        whereClause.include[0].where[Op.or].push(
          { correo: { [Op.like]: `%${correo.trim()}%` } }
        );
      }
      
      // Agregar filtro de DNI
      if (DNI && DNI.trim()) {
        whereClause.include[0].where[Op.or].push(
          { DNI: { [Op.like]: `%${DNI.trim()}%` } }
        );
      }
      
      // Agregar ordenamiento
      whereClause.order = [['idCliente', 'ASC']];
      
      console.log('Where clause construido:', JSON.stringify(whereClause, null, 2));
    } else {
      // Sin filtros, traer todos
      whereClause = {
        include: [{
          model: Persona,
          as: 'persona'
        }],
        order: [['idCliente', 'ASC']]
      };
    }

    const clientes = await Cliente.findAll(whereClause);
    console.log(`Clientes encontrados: ${clientes.length}`);
    
    res.json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ mensaje: 'Error al obtener clientes', error: error.message });
  }
};

// Obtener cliente por ID, incluyendo datos de Persona
const obtenerClientePorId = async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await Cliente.findByPk(id, {
      include: [{
        model: Persona,
        as: 'persona'
      }]
    });
    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener cliente', error: error.message });
  }
};

// Editar cliente
const editarCliente = [
  ...reglasEditar,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    const { id } = req.params;
    try {
      const cliente = await Cliente.findByPk(id);
      if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
      await cliente.update(req.body);
      res.json({ mensaje: 'Cliente actualizado', cliente });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al editar cliente', error: error.message });
    }
  }
];

// Eliminar cliente
const eliminarCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    await cliente.destroy();
    res.json({ mensaje: 'Cliente eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar cliente', error: error.message });
  }
};

// === EXPORTAR ===
module.exports = {
  crearCliente,
  obtenerClientes,
  obtenerClientePorId,
  editarCliente,
  eliminarCliente
};