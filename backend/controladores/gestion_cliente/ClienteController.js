const { body, validationResult } = require('express-validator');
const Cliente = require('../../modelos/gestion_cliente/Cliente');
const PersonaMongo = require('../../modelos/seguridad/PersonaMongo');
const Persona = require('../../modelos/seguridad/Persona'); // ✅ Importación que faltaba
const { Op } = require('sequelize');
const enviarCorreo = require('../../configuraciones/correo').EnviarCorreo;

// === VALIDACIONES ===
const reglasCrear = [
  body('idPersona')
    .notEmpty().withMessage('El idPersona es obligatorio')
    .isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo'),
  body('fechaRegistro')
    .optional()
    .isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)')
];

const reglasEditar = [
  body('idPersona')
    .optional()
    .isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo'),
  body('fechaRegistro')
    .optional()
    .isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)')
];

// === CONTROLADORES ===

// Crear cliente
exports.crearCliente = [
  ...reglasCrear,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    try {
      console.log('🔍 ClienteController - crearCliente - Datos recibidos:', req.body);
      const idPersonaInt = parseInt(req.body.idPersona);

      // Validar existencia de idPersona en Mongo
      const personaMongo = await PersonaMongo.findOne({ idPersona: idPersonaInt });
      if (!personaMongo) {
        console.log('❌ ClienteController - crearCliente - Persona Mongo no encontrada:', idPersonaInt);
        return res.status(400).json({ mensaje: 'La persona asociada (idPersona) no existe' });
      }
      console.log('✅ ClienteController - crearCliente - Persona Mongo encontrada:', personaMongo._id);

      // Validar/sincronizar persona en SQL
      let personaSQL = await Persona.findByPk(idPersonaInt);
      if (!personaSQL) {
        console.log('⚠️ ClienteController - crearCliente - Persona SQL no existe. Creando...');
        personaSQL = await Persona.create({
          idPersona: idPersonaInt,
          Pnombre: (personaMongo.Pnombre || '').substring(0, 45),
          Snombre: (personaMongo.Snombre || '').substring(0, 45),
          Papellido: (personaMongo.Papellido || '').substring(0, 45),
          Sapellido: (personaMongo.Sapellido || '').substring(0, 45),
          Direccion: (personaMongo.Direccion || '').substring(0, 45),
          DNI: (personaMongo.DNI || '').substring(0, 45),
          correo: (personaMongo.correo || '').substring(0, 45),
          fechaNacimiento: personaMongo.fechaNacimiento || null,
          genero: (personaMongo.genero || 'M').substring(0, 1)
        });
        console.log('✅ ClienteController - crearCliente - Persona SQL creada:', personaSQL.idPersona);
      }

      // Crear cliente
      const cliente = await Cliente.create({
        idPersona: idPersonaInt,
        fechaRegistro: req.body.fechaRegistro || undefined
      });
      console.log('✅ ClienteController - crearCliente - Cliente creado:', cliente.idCliente);

      // Enviar correo si hay email
 if (personaMongo.correo) {
      const adminCorreo = process.env.correousuario || "admin@optica.com"
      await enviarCorreo({
        para: personaMongo.correo,
        asunto: "¡Bienvenido a Óptica Velasquez!",
        descripcion: `Hola ${personaMongo.Pnombre}, su registro como cliente fue exitoso por el administrador (${adminCorreo}).`,
        html: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bienvenido a Óptica Velasquez</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>
              @media only screen and (max-width: 600px) {
                .container { width: 100% !important; margin: 0 !important; }
                .header { padding: 25px 20px !important; }
                .content { padding: 25px 20px !important; }
                .footer { padding: 20px !important; }
                .title { font-size: 24px !important; }
                .subtitle { font-size: 20px !important; }
                .service-grid { display: block !important; }
                .service-item { margin-bottom: 15px !important; }
              }
            </style>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div style="padding: 20px 10px;">
              <div class="container" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden;">
                
                <!-- Header compacto -->
                <div class="header" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 30px 25px; text-align: center;">
                  <h1 class="title" style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">👓 Óptica Velasquez</h1>
                  <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; font-weight: 300;">Tu visión, nuestra pasión</p>
                </div>

                <!-- Contenido principal compacto -->
                <div class="content" style="padding: 30px 25px;">
                  <div style="text-align: center; margin-bottom: 25px;">
                    <div style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; padding: 12px; margin-bottom: 15px;">
                      <span style="color: white; font-size: 20px;">✓</span>
                    </div>
                    <h2 class="subtitle" style="color: #1f2937; font-size: 24px; font-weight: 600; margin: 0 0 10px 0;">¡Bienvenido, ${personaMongo.Pnombre}!</h2>
                    <p style="color: #6b7280; font-size: 16px; line-height: 1.5; margin: 0;">Tu registro como cliente ha sido completado exitosamente por el administrador</p>
                  </div>

                  <!-- Servicios optimizados para móvil -->
                  <div style="background: #f8fafc; border-radius: 10px; padding: 20px; margin: 25px 0;">
                    <h3 style="color: #374151; font-size: 18px; font-weight: 600; margin: 0 0 15px 0; text-align: center;">¿Qué puedes esperar?</h3>
                    <div class="service-grid" style="text-align: center;">
                      <div class="service-item" style="display: inline-block; width: 45%; vertical-align: top; margin: 0 2% 10px 2%;">
                        <div style="background: #dbeafe; border-radius: 6px; padding: 8px; display: inline-block; margin-bottom: 8px;">
                          <span style="color: #3b82f6; font-size: 16px;">👁️</span>
                        </div>
                        <h4 style="color: #374151; font-size: 14px; font-weight: 500; margin: 0 0 3px 0;">Exámenes Profesionales</h4>
                        <p style="color: #6b7280; font-size: 12px; margin: 0;">Tecnología avanzada</p>
                      </div>
                      <div class="service-item" style="display: inline-block; width: 45%; vertical-align: top; margin: 0 2% 10px 2%;">
                        <div style="background: #dcfce7; border-radius: 6px; padding: 8px; display: inline-block; margin-bottom: 8px;">
                          <span style="color: #10b981; font-size: 16px;">⭐</span>
                        </div>
                        <h4 style="color: #374151; font-size: 14px; font-weight: 500; margin: 0 0 3px 0;">Calidad Premium</h4>
                        <p style="color: #6b7280; font-size: 12px; margin: 0;">Marcas reconocidas</p>
                      </div>
                      <div class="service-item" style="display: inline-block; width: 45%; vertical-align: top; margin: 0 2% 10px 2%;">
                        <div style="background: #fef3c7; border-radius: 6px; padding: 8px; display: inline-block; margin-bottom: 8px;">
                          <span style="color: #f59e0b; font-size: 16px;">🛡️</span>
                        </div>
                        <h4 style="color: #374151; font-size: 14px; font-weight: 500; margin: 0 0 3px 0;">Garantía Extendida</h4>
                        <p style="color: #6b7280; font-size: 12px; margin: 0;">Protección completa</p>
                      </div>
                      <div class="service-item" style="display: inline-block; width: 45%; vertical-align: top; margin: 0 2% 10px 2%;">
                        <div style="background: #fce7f3; border-radius: 6px; padding: 8px; display: inline-block; margin-bottom: 8px;">
                          <span style="color: #ec4899; font-size: 16px;">💎</span>
                        </div>
                        <h4 style="color: #374151; font-size: 14px; font-weight: 500; margin: 0 0 3px 0;">Diseños Exclusivos</h4>
                        <p style="color: #6b7280; font-size: 12px; margin: 0;">Últimas tendencias</p>
                      </div>
                    </div>
                  </div>

                  <!-- Call to action compacto -->
                  <div style="text-align: center; margin: 20px 0;">
                    <a href="tel:+1234567890" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: 600; font-size: 14px; box-shadow: 0 3px 10px rgba(79, 70, 229, 0.3); margin: 0 5px 10px 5px;">
                      📞 Agenda tu Cita
                    </a>
                    <a href="https://wa.me/1234567890" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: 600; font-size: 14px; box-shadow: 0 3px 10px rgba(16, 185, 129, 0.3); margin: 0 5px 10px 5px;">
                      💬 WhatsApp
                    </a>
                  </div>

                  <div style="background: #fef3c7; border-left: 3px solid #f59e0b; padding: 12px; border-radius: 0 6px 6px 0; margin: 20px 0;">
                    <p style="color: #92400e; font-size: 13px; margin: 0; font-weight: 500;">
                      💡 <strong>Tip:</strong> Recuerda traer tu receta médica actual para un mejor servicio.
                    </p>
                  </div>
                </div>

                <!-- Footer compacto -->
                <div class="footer" style="background: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <div style="margin-bottom: 15px;">
                    <h4 style="color: #374151; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">Contacto</h4>
                    <p style="color: #6b7280; font-size: 12px; margin: 3px 0;">📧 ${adminCorreo}</p>
                    <p style="color: #6b7280; font-size: 12px; margin: 3px 0;">📍 Av. Principal 123, Ciudad</p>
                    <p style="color: #6b7280; font-size: 12px; margin: 3px 0;">🕒 Lun-Vie 9:00-18:00, Sáb 9:00-14:00</p>
                  </div>
                  
                  <div style="border-top: 1px solid #e5e7eb; padding-top: 15px;">
                    <p style="color: #9ca3af; font-size: 11px; margin: 0; line-height: 1.4;">
                      © 2024 Óptica Velasquez. Todos los derechos reservados.<br>
                      Este correo fue enviado porque te registraste como cliente.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </body>
          </html>
        `,
      })
      console.log("📧 ClienteController - crearCliente - Correo enviado a:", personaMongo.correo)
    }

    res.status(201).json({ mensaje: "Cliente creado", cliente })
  } catch (error) {
    console.error("❌ ClienteController - crearCliente - Error:", error)
    res.status(500).json({ mensaje: "Error al crear cliente", error: error.message })
  }
}

];

// Obtener todos los clientes
exports.obtenerClientes = async (req, res) => {
  try {
    const { Pnombre, Papellido, correo, DNI } = req.query;
    console.log('Filtros recibidos en backend clientes:', { Pnombre, Papellido, correo, DNI });

    let whereClause = {};
    if ((Pnombre && Pnombre.trim()) || (Papellido && Papellido.trim()) || (correo && correo.trim()) || (DNI && DNI.trim())) {
      whereClause = {
        include: [{
          model: Persona,
          as: 'persona',
          where: { [Op.or]: [] }
        }],
        order: [['idCliente', 'ASC']]
      };

      if (Pnombre && Pnombre.trim()) {
        whereClause.include[0].where[Op.or].push(
          { Pnombre: { [Op.like]: `%${Pnombre.trim()}%` } },
          { Snombre: { [Op.like]: `%${Pnombre.trim()}%` } }
        );
      }
      if (Papellido && Papellido.trim()) {
        whereClause.include[0].where[Op.or].push(
          { Papellido: { [Op.like]: `%${Papellido.trim()}%` } },
          { Sapellido: { [Op.like]: `%${Papellido.trim()}%` } }
        );
      }
      if (correo && correo.trim()) {
        whereClause.include[0].where[Op.or].push({ correo: { [Op.like]: `%${correo.trim()}%` } });
      }
      if (DNI && DNI.trim()) {
        whereClause.include[0].where[Op.or].push({ DNI: { [Op.like]: `%${DNI.trim()}%` } });
      }
    } else {
      whereClause = {
        include: [{ model: Persona, as: 'persona' }],
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

// Obtener cliente por ID
exports.obtenerClientePorId = async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await Cliente.findByPk(id, {
      include: [{ model: Persona, as: 'persona' }]
    });
    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener cliente', error: error.message });
  }
};

// Editar cliente
exports.editarCliente = [
  ...reglasEditar,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    const { id } = req.params;
    try {
      if (req.body.idPersona) {
        const persona = await Persona.findByPk(req.body.idPersona);
        if (!persona) {
          return res.status(400).json({ mensaje: 'La persona asociada (idPersona) no existe' });
        }
      }
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
exports.eliminarCliente = async (req, res) => {
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
