const { body, validationResult } = require('express-validator');
const Empleado = require('../../modelos/gestion_cliente/Empleado');
const Persona = require('../../modelos/seguridad/Persona');
const { Op } = require('sequelize');

// === VALIDACIONES ===
const reglasCrear = [
  body('idPersona')
    .notEmpty().withMessage('El idPersona es obligatorio')
    .isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo'),
  body('Fecha_Registro')
    .optional()
    .isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)')
];

const reglasEditar = [
  body('idPersona')
    .optional()
    .isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo'),
  body('Fecha_Registro')
    .optional()
    .isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)')
];

// Crear empleado
exports.crearEmpleado = [
  ...reglasCrear,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    try {
      // Validar existencia de idPersona
      const persona = await Persona.findByPk(req.body.idPersona);
      if (!persona) {
        return res.status(400).json({ mensaje: 'La persona asociada (idPersona) no existe' });
      }
      const empleado = await Empleado.create(req.body);
      res.status(201).json({ mensaje: 'Empleado creado', empleado });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear empleado', error: error.message });
    }
  }
];

// Obtener todos los empleados con búsqueda por nombre/apellido/correo/DNI de Persona
exports.obtenerEmpleados = async (req, res) => {
  try {
    const { Pnombre, Papellido, correo, DNI } = req.query;
    console.log('Filtros recibidos en backend empleados:', { Pnombre, Papellido, correo, DNI });
    
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
      whereClause.order = [['idEmpleado', 'ASC']];
      
      console.log('Where clause construido empleados:', JSON.stringify(whereClause, null, 2));
    } else {
      // Sin filtros, traer todos
      whereClause = {
        include: [{
          model: Persona,
          as: 'persona'
        }],
        order: [['idEmpleado', 'ASC']]
      };
    }

    const empleados = await Empleado.findAll(whereClause);
    console.log(`Empleados encontrados: ${empleados.length}`);
    
    res.json(empleados);
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    res.status(500).json({ mensaje: 'Error al obtener empleados', error: error.message });
  }
};

// Obtener empleado por ID, incluyendo datos de Persona
exports.obtenerEmpleadoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const empleado = await Empleado.findByPk(id, {
      include: [{
        model: Persona,
        as: 'persona'
      }]
    });
    if (!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener empleado', error: error.message });
  }
};

// Editar empleado
exports.editarEmpleado = [
  ...reglasEditar,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    const { id } = req.params;
    try {
      // Si se envía idPersona, validar que exista
      if (req.body.idPersona) {
        const persona = await Persona.findByPk(req.body.idPersona);
        if (!persona) {
          return res.status(400).json({ mensaje: 'La persona asociada (idPersona) no existe' });
        }
      }
      const empleado = await Empleado.findByPk(id);
      if (!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
      await empleado.update(req.body);
      res.json({ mensaje: 'Empleado actualizado', empleado });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al editar empleado', error: error.message });
    }
  }
];

// Eliminar empleado
exports.eliminarEmpleado = async (req, res) => {
  const { id } = req.params;
  try {
    const empleado = await Empleado.findByPk(id);
    if (!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    await empleado.destroy();
    res.json({ mensaje: 'Empleado eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar empleado', error: error.message });
  }
};