// Production data utilities - no demo data
export const fetchRealData = async <T>(
  fetchFn: () => Promise<T[]>
): Promise<T[]> => {
  try {
    const realData = await fetchFn();
    return realData || [];
  } catch (error) {
    console.error('Error fetching real data:', error);
    return [];
  }
};

// Helper for creating empty data states
export const createEmptyDataState = <T>(message: string = "No data available") => ({
  data: [] as T[],
  message,
  isEmpty: true
});

// Helper for data validation
export const validateDataStructure = <T>(data: T[], requiredFields: string[]): boolean => {
  if (!data || data.length === 0) return true; // Empty is valid
  
  return data.every(item => 
    requiredFields.every(field => 
      item && typeof item === 'object' && field in item
    )
  );
};

// Helper for data transformation
export const transformApiData = <T, R>(
  data: T[],
  transformer: (item: T) => R
): R[] => {
  try {
    return data.map(transformer);
  } catch (error) {
    console.error('Error transforming data:', error);
    return [];
  }
};

// Helper for data filtering
export const filterDataByUser = <T extends { user_id?: string }>(
  data: T[],
  userId: string
): T[] => {
  return data.filter(item => item.user_id === userId);
};

// Helper for data sorting
export const sortDataByDate = <T extends { created_at?: string }>(
  data: T[],
  ascending: boolean = false
): T[] => {
  return [...data].sort((a, b) => {
    const dateA = new Date(a.created_at || 0).getTime();
    const dateB = new Date(b.created_at || 0).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

// Helper for data aggregation
export const aggregateDataByField = <T>(
  data: T[],
  field: keyof T
): Record<string, number> => {
  return data.reduce((acc, item) => {
    const value = String(item[field]);
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

// Helper for calculating metrics
export const calculateMetrics = (data: number[]): {
  total: number;
  average: number;
  min: number;
  max: number;
  count: number;
} => {
  if (data.length === 0) {
    return { total: 0, average: 0, min: 0, max: 0, count: 0 };
  }

  const total = data.reduce((sum, value) => sum + value, 0);
  const average = total / data.length;
  const min = Math.min(...data);
  const max = Math.max(...data);

  return { total, average, min, max, count: data.length };
};

// Helper for date range filtering
export const filterDataByDateRange = <T extends { created_at?: string }>(
  data: T[],
  startDate: Date,
  endDate: Date
): T[] => {
  return data.filter(item => {
    if (!item.created_at) return false;
    const itemDate = new Date(item.created_at);
    return itemDate >= startDate && itemDate <= endDate;
  });
};

// Helper for pagination
export const paginateData = <T>(
  data: T[],
  page: number,
  pageSize: number
): {
  data: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
} => {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    totalPages,
    currentPage: page,
    totalItems
  };
};

// Helper for search functionality
export const searchData = <T>(
  data: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] => {
  if (!searchTerm.trim()) return data;

  const lowercaseSearch = searchTerm.toLowerCase();
  
  return data.filter(item =>
    searchFields.some(field => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowercaseSearch);
      }
      return false;
    })
  );
};
