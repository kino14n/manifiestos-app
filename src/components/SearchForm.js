import React, { useState } from 'react';

const SearchForm = ({ onSearch, onReset }) => {
  const [codes, setCodes] = useState('');

  const handlePaste = (e) => {
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('Text');
    
    const processedData = pastedData
      .split('\n')
      .map(line => line.split('\t')[0].trim())
      .filter(code => code !== '')
      .join('\n');
    
    setCodes(processedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const codeList = codes.split('\n').filter(code => code.trim() !== '');
    onSearch({ codes: codeList });
  };

  const handleReset = () => {
    setCodes('');
    onReset();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Buscar Documentos</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Códigos (pega desde Excel o escribe uno por línea)
          </label>
          <textarea
            value={codes}
            onChange={(e) => setCodes(e.target.value)}
            onPaste={handlePaste}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={5}
            placeholder="Pega aquí los códigos desde Excel o escribe uno por línea"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Buscar
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Nueva Búsqueda
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;