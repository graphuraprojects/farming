import React from 'react';

const Row = ({label, value}) => {
  return (
    <div className="flex justify-between text-sm">
    <span className="text-gray-600">{label}</span>
    <span className="font-bold">{value}</span>
  </div>
  );
}

export default Row;
