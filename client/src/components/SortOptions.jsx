// src/components/SortOptions.jsx

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSortOrder } from '/src/redux/slices/dogsSlice';

const SortOptions = () => {
  const dispatch = useDispatch();
  const sortOrder = useSelector((state) => state.dogs.sortOrder);

  const handleSortChange = (e) => {
    dispatch(setSortOrder(e.target.value));
  };

  return (
    <div>
      <select value={sortOrder} onChange={handleSortChange}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default SortOptions;

