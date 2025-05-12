import React from 'react';

const SummaryCards = ({ results }) => {
  const uniqueCodes = [...new Set(results.map(doc => doc.code))];
  const docCount = results.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500">Códigos encontrados</h3>
        <p className="text-2xl font-semibold">{uniqueCodes.length}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500">Documentos encontrados</h3>
        <p className="text-2xl font-semibold">{docCount}</p>
      </div>
    </div>
  );
};

export default SummaryCards;