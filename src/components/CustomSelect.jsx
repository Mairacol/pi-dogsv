// src/components/CustomSelect.jsx
import React from 'react';
import Select from 'react-select';
import './CustomSelect.css'; // Archivo CSS para estilos personalizados

const CustomSelect = ({ options, onChange }) => {
  return (
    <Select
      options={options}
      onChange={onChange}
      className="custom-select"
      classNamePrefix="select"
    />
  );
};

export default CustomSelect;
