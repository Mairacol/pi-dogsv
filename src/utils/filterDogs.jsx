// src/utils/filterDogs.jsx
export const filterDogs = (dogs, searchTerm, temperamentFilter, originFilter, sortOrder) => {
    let filtered = [...dogs]; // Crea una copia superficial del array

    // Filtro por término de búsqueda
    if (searchTerm) {
        filtered = filtered.filter(dog => dog.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Filtro por temperamento
    if (temperamentFilter) {
        filtered = filtered.filter(dog => {
            // Si el temperamento es un array, úsalo directamente. Si es una cadena, divídela en un array.
            // Asegúrate de manejar tanto el campo `temperament` como `temperaments`.
            const temperaments = Array.isArray(dog.temperament) 
                ? dog.temperament 
                : dog.temperament 
                    ? dog.temperament.split(', ') 
                    : Array.isArray(dog.temperaments) 
                        ? dog.temperaments 
                        : dog.temperaments 
                            ? dog.temperaments.split(', ') 
                            : [];
    
            return temperaments.includes(temperamentFilter);
        });
    }
    

    // Filtro por origen
    if (originFilter) {
        filtered = filtered.filter(dog => {
            const isApi = !dog.created; // Si `created` es falso, es de la API
            const isDb = dog.created; // Si `created` es verdadero, es de la base de datos
            if (originFilter === 'API') {
                return isApi; // Solo datos de la API
            } else if (originFilter === 'DB') {
                return isDb; // Solo datos de la base de datos
            }
            return true; // Si el filtro no coincide, no filtra
        });
    }

    // Ordenar resultados
    if (sortOrder) {
        filtered = [...filtered]; // Crea una copia antes de ordenar
        if (sortOrder === 'name-asc') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOrder === 'name-desc') {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortOrder === 'weight-asc') {
            filtered.sort((a, b) => {
                const weightA = a.weight && a.weight.metric ? a.weight.metric.split(' - ')[0] : '0';
                const weightB = b.weight && b.weight.metric ? b.weight.metric.split(' - ')[0] : '0';
                return parseFloat(weightA) - parseFloat(weightB);
            });
        } else if (sortOrder === 'weight-desc') {
            filtered.sort((a, b) => {
                const weightA = a.weight && a.weight.metric ? a.weight.metric.split(' - ')[0] : '0';
                const weightB = b.weight && b.weight.metric ? b.weight.metric.split(' - ')[0] : '0';
                return parseFloat(weightB) - parseFloat(weightA);
            });
        }
    }

    return filtered;
};
