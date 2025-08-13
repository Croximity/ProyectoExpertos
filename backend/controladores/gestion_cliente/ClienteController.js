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
        const adminCorreo = process.env.correousuario || "admin@optica.com";
        await enviarCorreo({
          para: personaMongo.correo,
          asunto: "¡Bienvenido a Óptica Velasquez!",
          descripcion: `Hola ${personaMongo.Pnombre}, su registro como cliente fue exitoso por el administrador (${adminCorreo}).`,
          html: `<h1>Bienvenido ${personaMongo.Pnombre}</h1><p>Tu registro fue exitoso.</p>`
        });
        console.log('📧 ClienteController - crearCliente - Correo enviado a:', personaMongo.correo);
      }

      res.status(201).json({ mensaje: "Cliente creado", cliente });
    } catch (error) {
      console.error('❌ ClienteController - crearCliente - Error:', error);
      res.status(500).json({ mensaje: "Error al crear cliente", error: error.message });
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
