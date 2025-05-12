import React, { useState } from 'react';

const ResultsTable = ({ results, onPrint, searchedCodes }) => {
  const [selectedDocs, setSelectedDocs] = useState([]);

  // Encontrar códigos no encontrados
  const foundCodes = new Set();
  results.forEach(doc => {
    const docCodes = doc.code.split(', ');
    searchedCodes.forEach(code => {
      if (docCodes.includes(code)) {
        foundCodes.add(code);
      }
    });
  });

  const notFoundCodes = searchedCodes.filter(code => !foundCodes.has(code));

  const toggleDocSelection = (docId) => {
    setSelectedDocs(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId) 
        : [...prev, docId]
    );
  };

  const handlePrintSelected = () => {
    selectedDocs.forEach(docId => {
      const doc = results.find(d => d.id === docId);
      if (doc) {
        onPrint(doc.pdfName);
      }
    });
    setSelectedDocs([]);
  };

  // Obtener los códigos buscados que están en este documento
  const getMatchingCodes = (docCode) => {
    const docCodes = docCode.split(', ');
    return searchedCodes.filter(code => docCodes.includes(code)).join(', ');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Resultados</h2>
        {selectedDocs.length > 0 && (
          <button
            onClick={handlePrintSelected}
            className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors shadow-sm"
          >
            Imprimir Seleccionados ({selectedDocs.length})
          </button>
        )}
      </div>
      
      {results.length === 0 ? (
        <p className="text-gray-500">No se encontraron documentos</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seleccionar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Códigos Encontrados</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número Doc</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedDocs.includes(doc.id)}
                      onChange={() => toggleDocSelection(doc.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getMatchingCodes(doc.code)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.docNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => onPrint(doc.pdfName)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Imprimir
                    </button>
                  </td>
                </tr>
              ))}
              {notFoundCodes.length > 0 && (
                <tr className="bg-gray-50">
                  <td colSpan="5" className="px-6 py-4 text-sm text-gray-500">
                    <span className="font-medium underline">Códigos no encontrados:</span> {notFoundCodes.join(', ')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;

// DONE