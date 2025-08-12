# 🪝 Hooks Optimizados - ProyectoExpertos

Este documento describe los hooks personalizados optimizados que utilizan `useEffect`, `useState`, `useMemo` y `useContext` de manera eficiente para optimizar renderizados y compartir estado.

## 🚀 **useAuthPersistence**

**Propósito**: Gestiona la persistencia de autenticación y sincronización entre pestañas.

**Optimizaciones aplicadas**:
- `useCallback` para funciones que se pasan como dependencias
- `useMemo` para el objeto de retorno
- Evita recreaciones innecesarias de funciones

**Uso**:
```javascript
import { useAuthPersistence } from '../hooks/useAuthPersistence';

const { user, setUser, loading } = useAuthPersistence();
```

## 🔐 **useAuth (Context)**

**Propósito**: Hook que consume el contexto de autenticación.

**Optimizaciones aplicadas**:
- `useCallback` para todas las funciones del contexto
- `useMemo` para el valor del contexto
- Evita re-renders innecesarios en componentes hijos

**Uso**:
```javascript
import { useAuth } from '../contexts/AuthContext';

const { user, login, logout, isAuthenticated } = useAuth();
```

## 🔔 **useToast**

**Propósito**: Maneja notificaciones toast con diferentes tipos.

**Optimizaciones aplicadas**:
- `useMemo` para el estado inicial
- `useCallback` para todas las funciones
- `useMemo` para el objeto de retorno

**Uso**:
```javascript
import { useToast } from '../hooks/useToast';

const { toast, showSuccess, showError, showWarning, showInfo } = useToast();

// Ejemplo de uso
showSuccess('Operación completada exitosamente');
showError('Ha ocurrido un error');
```

## 📝 **useForm**

**Propósito**: Hook completo para manejo de formularios con validación.

**Optimizaciones aplicadas**:
- `useMemo` para el estado inicial
- `useCallback` para todas las funciones
- `useMemo` para el objeto de retorno
- Validación automática en blur

**Uso**:
```javascript
import { useForm } from '../hooks/useForm';

// Esquema de validación
const validationSchema = {
  nombre: (value) => !value ? 'El nombre es requerido' : null,
  email: (value) => !value ? 'El email es requerido' : !/\S+@\S+\.\S+/.test(value) ? 'Email inválido' : null
};

const {
  formData,
  errors,
  touched,
  isSubmitting,
  handleChange,
  handleBlur,
  submitForm,
  resetForm
} = useForm({
  nombre: '',
  email: ''
}, validationSchema);

// En el JSX
<input
  name="nombre"
  value={formData.nombre}
  onChange={(e) => handleChange('nombre', e.target.value)}
  onBlur={() => handleBlur('nombre')}
/>
{errors.nombre && touched.nombre && <span className="error">{errors.nombre}</span>}

// Enviar formulario
const handleSubmit = async () => {
  const success = await submitForm(async (data) => {
    // Lógica de envío
    await apiService.create(data);
  });
  
  if (success) {
    resetForm();
  }
};
```

## 📋 **useList**

**Propósito**: Hook para manejo eficiente de listas con filtrado, búsqueda, ordenamiento y paginación.

**Optimizaciones aplicadas**:
- `useMemo` para datos filtrados, ordenados y paginados
- `useCallback` para todas las funciones de acción
- Cálculos memoizados para evitar recálculos innecesarios

**Uso**:
```javascript
import { useList } from '../hooks/useList';

const {
  data,           // Datos de la página actual
  allData,        // Todos los datos filtrados
  filters,        // Filtros aplicados
  searchTerm,     // Término de búsqueda
  currentPage,    // Página actual
  paginationInfo, // Información de paginación
  setFilter,      // Establecer filtro
  setSearch,      // Establecer búsqueda
  goToPage,       // Ir a página específica
  nextPage,       // Siguiente página
  prevPage,       // Página anterior
  sortBy,         // Ordenar por campo
  updateData      // Actualizar datos
} = useList(productos, {
  itemsPerPage: 10,
  searchFields: ['nombre', 'descripcion'],
  initialFilters: { categoria: 'lentes' }
});

// Aplicar filtro
setFilter('categoria', 'gafas');

// Buscar
setSearch('ray-ban');

// Ordenar
sortBy('precio');

// Paginación
nextPage();
goToPage(3);
```

## 🎯 **Mejores Prácticas Implementadas**

### 1. **Memoización de Objetos**
```javascript
// ❌ Mal: Objeto recreado en cada render
const contextValue = { user, login, logout };

// ✅ Bien: Objeto memoizado
const contextValue = useMemo(() => ({
  user, login, logout
}), [user, login, logout]);
```

### 2. **Memoización de Funciones**
```javascript
// ❌ Mal: Función recreada en cada render
const handleClick = () => { /* ... */ };

// ✅ Bien: Función memoizada
const handleClick = useCallback(() => { /* ... */ }, []);
```

### 3. **Memoización de Cálculos Costosos**
```javascript
// ❌ Mal: Cálculo ejecutado en cada render
const filteredData = data.filter(item => /* ... */);

// ✅ Bien: Cálculo memoizado
const filteredData = useMemo(() => 
  data.filter(item => /* ... */), 
  [data, filters]
);
```

### 4. **Dependencias Correctas en useEffect**
```javascript
// ✅ Correcto: Dependencias explícitas
useEffect(() => {
  // ...
}, [checkAuthStatus, handleStorageChange]);
```

## 🔧 **Configuración de ESLint**

Para aprovechar al máximo estas optimizaciones, asegúrate de tener configurado ESLint con las reglas de hooks:

```json
{
  "rules": {
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/rules-of-hooks": "error"
  }
}
```

## 📊 **Beneficios de las Optimizaciones**

1. **Menos Re-renders**: Los componentes solo se re-renderizan cuando es necesario
2. **Mejor Performance**: Cálculos costosos se ejecutan solo cuando cambian las dependencias
3. **Estado Consistente**: El estado se comparte eficientemente entre componentes
4. **Código Reutilizable**: Hooks que pueden usarse en múltiples componentes
5. **Mantenibilidad**: Lógica centralizada y fácil de mantener

## 🚨 **Consideraciones Importantes**

- **No sobre-optimizar**: Solo memoiza cuando sea necesario
- **Dependencias correctas**: Siempre incluye todas las dependencias en los arrays
- **Testing**: Los hooks memoizados son más fáciles de testear
- **Debugging**: Usa React DevTools para verificar que las optimizaciones funcionen
