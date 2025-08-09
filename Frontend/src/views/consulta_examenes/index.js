// Panel principal
export { default as PanelConsultaExamenes } from './PanelConsultaExamenes';

// Recetas
export { default as Recetas } from './Recetas';
export { default as RecetaForm } from './RecetaForm';

// Exámenes de Vista
export { default as ExamenesVista } from './ExamenesVista';
export { default as ExamenVistaForm } from './ExamenVistaForm';

// Diagnósticos
export { default as Diagnosticos } from './Diagnosticos';
export { default as DiagnosticoForm } from './DiagnosticoForm';

// Tipos de Enfermedad
export { default as TiposEnfermedad } from './TiposEnfermedad';

// Reparación de Lentes
export { default as ReparacionLentes } from './ReparacionLentes';

// Re-export de servicios para facilidad de uso
export { recetaService } from '../../services/consulta_examenes/recetaService';
export { examenVistaService } from '../../services/consulta_examenes/examenVistaService';
export { diagnosticoService } from '../../services/consulta_examenes/diagnosticoService';
export { tipoEnfermedadService } from '../../services/consulta_examenes/tipoEnfermedadService';
export { reparacionLentesService } from '../../services/consulta_examenes/reparacionLentesService';
