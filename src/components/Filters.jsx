// src/components/Filters.jsx
import React from 'react';
import Select from 'react-select';
import './Filters.css';

const Filters = ({ temperaments, setTemperamentFilter, setOriginFilter, setSortOrder, temperamentFilter, originFilter, sortOrder }) => {
  const temperamentOptions = [
    { value: '', label: 'All Temperaments' },
    ...temperaments.map(temp => ({ value: temp, label: temp }))
  ];
  const originOptions = [
    { value: '', label: 'All Origins' },
    { value: 'API', label: 'API' },
    { value: 'DB', label: 'Database' }
  ];
  const sortOptions = [
    { value: '', label: 'Sort By' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'weight-asc', label: 'Weight (Low-High)' },
    { value: 'weight-desc', label: 'Weight (High-Low)' }
  ];

  const handleSelectChange = (selectedOption, actionMeta) => {
    switch (actionMeta.name) {
      case 'temperament':
        setTemperamentFilter(selectedOption ? selectedOption.value : '');
        break;
      case 'origin':
        setOriginFilter(selectedOption ? selectedOption.value : '');
        break;
      case 'sortOrder':
        setSortOrder(selectedOption ? selectedOption.value : '');
        break;
      default:
        break;
    }
  };

  return (
    <div className="filters">
      <Select
        name="temperament"
        options={temperamentOptions}
        onChange={handleSelectChange}
        className="custom-select"
        classNamePrefix="select"
        placeholder="All Temperaments"
        value={temperamentOptions.find(option => option.value === temperamentFilter) || null}
      />
      <Select
        name="origin"
        options={originOptions}
        onChange={handleSelectChange}
        className="custom-select"
        classNamePrefix="select"
        placeholder="All Origins"
        value={originOptions.find(option => option.value === originFilter) || null}
      />
      <Select
        name="sortOrder"
        options={sortOptions}
        onChange={handleSelectChange}
        className="custom-select"
        classNamePrefix="select"
        placeholder="Sort By"
        value={sortOptions.find(option => option.value === sortOrder) || null}
      />
    </div>
  );
};

export default Filters;
