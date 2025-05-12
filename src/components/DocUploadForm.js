import React, { useState } from 'react';

const DocUploadForm = ({ onUpload }) => {
  const [formData, setFormData] = useState({
    date: '',
    code: '',
    docNumber: '',
    pdfFile: null,
    pdfName: ''
  });

  const handlePasteCode = (e) => {
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('Text');
    
    const processedData = pastedData
      .split('\n')
      .map(line => line.split('\t')[0].trim())
      .filter(code => code !== '')
      .join(', ');
    
    setFormData(prev => ({ ...prev, code: processedData }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        pdfFile: file,
        pdfName: file.name
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpload(formData);
    setFormData({
      date: '',
      code: '',
      docNumber: '',
      pdfFile: null,
      pdfName: ''
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Subir Nuevo Documento</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Código(s) (pega desde Excel)</label>
          <textarea
            name="code"
            value={formData.code}
            onChange={handleChange}
            onPaste={handlePasteCode}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
            placeholder="Pega aquí una columna completa desde Excel"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Número de Documento</label>
          <input
            type="text"
            name="docNumber"
            value={formData.docNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Archivo PDF</label>
          <input
            type="file"
            name="pdfFile"
            onChange={handleFileChange}
            accept=".pdf"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {formData.pdfName && (
            <p className="mt-1 text-sm text-gray-500">Archivo seleccionado: {formData.pdfName}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Subir Documento
        </button>
      </form>
    </div>
  );
};

export default DocUploadForm;