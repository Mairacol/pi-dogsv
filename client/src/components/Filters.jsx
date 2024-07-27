import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOriginFilter } from '/src/redux/slices/dogsSlice';

const Filters = () => {
  const dispatch = useDispatch();
  const originFilter = useSelector((state) => state.dogs.originFilter);

  const handleOriginChange = (e) => {
    dispatch(setOriginFilter(e.target.value));
  };

  return (
    <div>
      <select value={originFilter} onChange={handleOriginChange}>
        <option value="all">All</option>
        <option value="api">API</option>
        <option value="database">Database</option>
      </select>
    </div>
  );
};

export default Filters;