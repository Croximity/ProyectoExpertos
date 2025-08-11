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
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    try {
      const cliente = await Cliente.create(req.body);
      // Buscar el correo de la persona asociada
      const persona = await Persona.findByPk(req.body.idPersona);
      if (persona && persona.correo) {
        // Enviar correo con HTML bonito
        const adminCorreo = process.env.correousuario || 'admin@optica.com';
        await enviarCorreo({
          para: persona.correo,
          asunto: '¡Bienvenido a Óptica Expertos!',
          descripcion: `Hola ${persona.Pnombre}, su registro como cliente fue exitoso por el administrador (${adminCorreo}).`,
          html: `
            <div style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 30px;">
              <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #ccc; padding: 24px;">
                <h2 style="color: #2e7d32; text-align: center;">¡Bienvenido a Óptica Expertos!</h2>
                <p style="font-size: 18px; color: #333;">Hola <b>${persona.Pnombre}</b>,</p>
                <p style="font-size: 16px; color: #333;">Te informamos que has sido registrado exitosamente como cliente por el administrador.</p>
                <p style="font-size: 16px; color: #333;">Si tienes dudas, puedes contactarnos respondiendo a este correo.</p>
                <hr style="margin: 24px 0;">
                <p style="font-size: 14px; color: #888;">Correo del administrador: <b>${adminCorreo}</b></p>
                <p style="font-size: 14px; color: #888; text-align: center;">Gracias por confiar en nosotros.<br>Óptica Expertos</p>
              </div>
            </div>
          `
        });
      }
      res.status(201).json({ mensaje: 'Cliente creado', cliente });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear cliente', error: error.message });
    }
  }
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