const { body, validationResult } = require('express-validator');
const db = require('../../configuraciones/db');

// === VALIDACIONES ===
const reglasCrear = [
  body('idExamen')
    .notEmpty().withMessage('El idExamen es obligatorio')
    .isInt().withMessage('El idExamen debe ser un número entero'),
  body('idTipoEnfermedad')
    .notEmpty().withMessage('El idTipoEnfermedad es obligatorio')
    .isInt().withMessage('El idTipoEnfermedad debe ser un número entero')
];

const reglasEditar = [
  body('idExamen')
    .optional()
    .isInt().withMessage('El idExamen debe ser un número entero'),
  body('idTipoEnfermedad')
    .optional()
    .isInt().withMessage('El idTipoEnfermedad debe ser un número entero')
];

// === CONTROLADORES ===

// Crear diagnóstico
const guardarDiagnostico = [
  ...reglasCrear,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    try {
      const { idExamen, idTipoEnfermedad } = req.body;
      
      const [result] = await db.query(
        'INSERT INTO diagnostico (idExamen, idTipoEnfermedad) VALUES (?, ?)',
        [idExamen, idTipoEnfermedad]
      );
      
      const diagnostico = {
        idDiagnostico: result.insertId,
        idExamen,
        idTipoEnfermedad
      };
      
      res.status(201).json({ mensaje: 'Diagnóstico creado', diagnostico });
    } catch (error) {
      console.error('Error al crear diagnóstico:', error);
      res.status(500).json({ mensaje: 'Error al crear diagnóstico', error: error.message });
    }
  }
];

// Obtener todos los diagnósticos
const listarDiagnostico = async (req, res) => {
  try {
    console.log('🔍 Iniciando listado de diagnósticos...');
    
    // Usar consulta SQL directa
    const [diagnosticos] = await db.query('SELECT * FROM diagnostico ORDER BY idDiagnostico DESC');
    
    console.log(`✅ Diagnósticos obtenidos exitosamente: ${diagnosticos.length} registros`);
    console.log('📊 Datos obtenidos:', diagnosticos);
    
    res.json(diagnosticos);
    
  } catch (error) {
    console.error('❌ Error al obtener diagnósticos:', error);
    console.error('❌ Stack trace:', error.stack);
    
    res.status(500).json({ 
      mensaje: 'Error al obtener diagnósticos', 
      error: error.message
    });
  }
};

// Obtener diagnóstico por ID
const obtenerDiagnosticoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    console.log(`🔍 Buscando diagnóstico con ID: ${id}`);
    
    const [results] = await db.query(
      'SELECT * FROM diagnostico WHERE idDiagnostico = ?', 
      [id]
    );
    
    if (results.length === 0) {
      console.log(`❌ Diagnóstico con ID ${id} no encontrado`);
      return res.status(404).json({ mensaje: 'Diagnóstico no encontrado' });
    }
    
    const diagnostico = results[0];
    console.log(`✅ Diagnóstico encontrado:`, diagnostico);
    res.json(diagnostico);
    
  } catch (error) {
    console.error(`❌ Error al obtener diagnóstico con ID ${id}:`, error);
    res.status(500).json({ mensaje: 'Error al obtener diagnóstico', error: error.message });
  }
};

// Editar diagnóstico
const editarDiagnostico = [
  ...reglasEditar,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    const { id } = req.params;
    try {
      console.log(`🔍 Editando diagnóstico con ID: ${id}`);
      
      // Verificar que el diagnóstico existe
      const [existing] = await db.query(
        'SELECT * FROM diagnostico WHERE idDiagnostico = ?', 
        [id]
      );
      
      if (existing.length === 0) {
        console.log(`❌ Diagnóstico con ID ${id} no encontrado para editar`);
        return res.status(404).json({ mensaje: 'Diagnóstico no encontrado' });
      }
      
      // Construir la consulta de actualización dinámicamente
      const updateFields = [];
      const updateValues = [];
      
      if (req.body.idExamen !== undefined) {
        updateFields.push('idExamen = ?');
        updateValues.push(req.body.idExamen);
      }
      if (req.body.idTipoEnfermedad !== undefined) {
        updateFields.push('idTipoEnfermedad = ?');
        updateValues.push(req.body.idTipoEnfermedad);
      }
      
      if (updateFields.length === 0) {
        return res.status(400).json({ mensaje: 'No hay campos para actualizar' });
      }
      
      updateValues.push(id); // Para el WHERE
      
      const updateQuery = `UPDATE diagnostico SET ${updateFields.join(', ')} WHERE idDiagnostico = ?`;
      await db.query(updateQuery, updateValues);
      
      // Obtener el diagnóstico actualizado
      const [updated] = await db.query(
        'SELECT * FROM diagnostico WHERE idDiagnostico = ?', 
        [id]
      );
      
      console.log(`✅ Diagnóstico con ID ${id} actualizado exitosamente`);
      res.json({ mensaje: 'Diagnóstico actualizado', diagnostico: updated[0] });
      
    } catch (error) {
      console.error(`❌ Error al editar diagnóstico con ID ${id}:`, error);
      res.status(500).json({ mensaje: 'Error al editar diagnóstico', error: error.message });
    }
  }
];

// Eliminar diagnóstico
const eliminarDiagnostico = async (req, res) => {
  const { id } = req.params;
  try {
    console.log(`🔍 Eliminando diagnóstico con ID: ${id}`);
    
    // Verificar que el diagnóstico existe
    const [existing] = await db.query(
      'SELECT * FROM diagnostico WHERE idDiagnostico = ?', 
      [id]
    );
    
    if (existing.length === 0) {
      console.log(`❌ Diagnóstico con ID ${id} no encontrado para eliminar`);
      return res.status(404).json({ mensaje: 'Diagnóstico no encontrado' });
    }
    
    await db.query('DELETE FROM diagnostico WHERE idDiagnostico = ?', [id]);
    console.log(`✅ Diagnóstico con ID ${id} eliminado exitosamente`);
    
    res.json({ mensaje: 'Diagnóstico eliminado' });
  } catch (error) {
    console.error(`❌ Error al eliminar diagnóstico con ID ${id}:`, error);
    res.status(500).json({ mensaje: 'Error al eliminar diagnóstico', error: error.message });
  }
};

// === EXPORTAR ===
module.exports = {
  guardarDiagnostico,
  listarDiagnostico,
  obtenerDiagnosticoPorId,
  editarDiagnostico,
  eliminarDiagnostico
};