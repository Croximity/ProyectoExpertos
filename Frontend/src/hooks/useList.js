import { useState, useCallback, useMemo } from 'react';

export const useList = (initialData = [], options = {}) => {
  const {
    itemsPerPage = 10,
    initialPage = 1,
    initialFilters = {},
    searchFields = []
  } = options;

  const [data, setData] = useState(initialData);
  const [filters, setFilters] = useState(initialFilters);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Memoizar datos filtrados para evitar recálculos innecesarios
  const filteredData = useMemo(() => {
    let result = [...data];

    // Aplicar filtros
    if (Object.keys(filters).length > 0) {
      result = result.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value || value === '') return true;
          return item[key] === value;
        });
      });
    }

    // Aplicar búsqueda
    if (searchTerm && searchFields.length > 0) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => {
        return searchFields.some(field => {
          const value = item[field];
          return value && value.toString().toLowerCase().includes(term);
        });
      });
    }

    return result;
  }, [data, filters, searchTerm, searchFields]);

  // Memoizar datos ordenados
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Memoizar datos paginados
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, itemsPerPage]);

  // Memoizar información de paginación
  const paginationInfo = useMemo(() => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    return {
      currentPage,
      totalPages,
      totalItems: filteredData.length,
      itemsPerPage,
      hasNextPage,
      hasPrevPage,
      startIndex: (currentPage - 1) * itemsPerPage + 1,
      endIndex: Math.min(currentPage * itemsPerPage, filteredData.length)
    };
  }, [filteredData.length, currentPage, itemsPerPage]);

  // Funciones memoizadas
  const setFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Resetear a primera página al filtrar
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setCurrentPage(1);
  }, [initialFilters]);

  const setSearch = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Resetear a primera página al buscar
  }, []);

  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, paginationInfo.totalPages)));
  }, [paginationInfo.totalPages]);

  const nextPage = useCallback(() => {
    if (paginationInfo.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [paginationInfo.hasNextPage]);

  const prevPage = useCallback(() => {
    if (paginationInfo.hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [paginationInfo.hasPrevPage]);

  const sortBy = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const updateData = useCallback((newData) => {
    setData(newData);
    setCurrentPage(1); // Resetear a primera página al actualizar datos
  }, []);

  // Memoizar el objeto de retorno
  const listActions = useMemo(() => ({
    // Datos
    data: paginatedData,
    allData: sortedData,
    originalData: data,
    
    // Estado
    filters,
    searchTerm,
    currentPage,
    sortConfig,
    
    // Información de paginación
    paginationInfo,
    
    // Acciones
    setFilter,
    clearFilters,
    setSearch,
    goToPage,
    nextPage,
    prevPage,
    sortBy,
    updateData,
    setData
  }), [
    paginatedData,
    sortedData,
    data,
    filters,
    searchTerm,
    currentPage,
    sortConfig,
    paginationInfo,
    setFilter,
    clearFilters,
    setSearch,
    goToPage,
    nextPage,
    prevPage,
    sortBy,
    updateData
  ]);

  return listActions;
};
