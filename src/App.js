import React, { useState } from 'react';
import mockDocuments from './mock/documents';
import DocUploadForm from './components/DocUploadForm';
import SearchForm from './components/SearchForm';
import ResultsTable from './components/ResultsTable';
import SummaryCards from './components/SummaryCards';
import PDFExplorer from './components/PDFExplorer';

const App = () => {
  const [documents, setDocuments] = useState(mockDocuments);
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState('search');
  const [searchedCodes, setSearchedCodes] = useState([]);

  const handleUpload = (newDoc) => {
    const newDocument = {
      id: documents.length + 1,
      date: newDoc.date,
      code: newDoc.code,
      docNumber: newDoc.docNumber,
      pdfName: newDoc.pdfName
    };
    setDocuments([...documents, newDocument]);
  };

  const findOptimalDocuments = (codes, allDocuments) => {
    if (codes.length === 0) return { documents: [], notFoundCodes: [] };

    const targetCodes = new Set(codes);
    
    // 1. Filtrar documentos recientes (últimos 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentDocs = allDocuments.filter(doc => 
      new Date(doc.date) >= thirtyDaysAgo
    );

    // 2. Buscar documentos recientes que cubran todos los códigos
    const fullCoverageDocs = recentDocs.filter(doc => {
      const docCodes = new Set(doc.code.split(', '));
      return [...targetCodes].every(code => docCodes.has(code));
    });

    // Si encontramos uno o más documentos recientes que cubren todo, devolver el más reciente
    if (fullCoverageDocs.length > 0) {
      const mostRecentFullCoverage = fullCoverageDocs.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      )[0];
      return {
        documents: [mostRecentFullCoverage],
        notFoundCodes: []
      };
    }

    // 3. Si no, buscar cualquier documento (sin filtrar por fecha) que cubra todo
    const anyFullCoverageDoc = allDocuments.find(doc => {
      const docCodes = new Set(doc.code.split(', '));
      return [...targetCodes].every(code => docCodes.has(code));
    });

    if (anyFullCoverageDoc) {
      return {
        documents: [anyFullCoverageDoc],
        notFoundCodes: []
      };
    }

    // 4. Algoritmo greedy para encontrar cobertura mínima
    const relevantDocs = allDocuments.filter(doc => {
      const docCodes = new Set(doc.code.split(', '));
      return [...targetCodes].some(code => docCodes.has(code));
    });

    // Preparar datos para el algoritmo greedy
    const docCoverage = relevantDocs.map(doc => ({
      id: doc.id,
      doc,
      codes: new Set(doc.code.split(', ').filter(code => targetCodes.has(code))),
      date: new Date(doc.date)
    }));

    const selectedDocs = [];
    const coveredCodes = new Set();
    let remainingCodes = new Set(targetCodes);

    while (remainingCodes.size > 0) {
      // Encontrar el documento que cubra más códigos restantes
      let bestDoc = null;
      let maxCoverage = 0;
      let latestDate = null;

      docCoverage.forEach(({ id, doc, codes, date }) => {
        if (!selectedDocs.some(d => d.id === id)) {
          const coverage = [...codes].filter(code => 
            remainingCodes.has(code)
          ).length;

          if (coverage > maxCoverage || 
              (coverage === maxCoverage && date > latestDate)) {
            bestDoc = { id, doc, codes, date };
            maxCoverage = coverage;
            latestDate = date;
          }
        }
      });

      if (!bestDoc) break; // No hay más documentos que cubran códigos restantes

      // Agregar documento a la selección
      selectedDocs.push(bestDoc);
      bestDoc.codes.forEach(code => {
        coveredCodes.add(code);
        remainingCodes.delete(code);
      });
    }

    // Ordenar documentos por fecha descendente
    const resultDocs = selectedDocs
      .sort((a, b) => b.date - a.date)
      .map(item => item.doc);

    return {
      documents: resultDocs,
      notFoundCodes: [...remainingCodes]
    };
  };

  const handleSearch = ({ codes }) => {
    setSearchedCodes(codes);
    const { documents: filtered, notFoundCodes } = findOptimalDocuments(codes, documents);
    setSearchResults(filtered);
  };

  const handleResetSearch = () => {
    setSearchResults([]);
    setSearchedCodes([]);
  };

  const handlePrintPDF = (pdfName) => {
    alert(`Abriendo PDF: ${pdfName}\n\nEn una implementación real, esto abriría el archivo PDF para imprimir.`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">DocuTrack Perfect</h1>
        
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('search')}
            className={`py-2 px-4 font-medium ${activeTab === 'search' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Buscar Documentos
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`py-2 px-4 font-medium ${activeTab === 'explorer' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Explorar Todos
          </button>
        </div>

        {activeTab === 'search' ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DocUploadForm onUpload={handleUpload} />
              <SearchForm onSearch={handleSearch} onReset={handleResetSearch} />
            </div>
            
            {searchResults.length > 0 ? (
              <>
                <SummaryCards results={searchResults} />
                <ResultsTable 
                  results={searchResults} 
                  onPrint={handlePrintPDF} 
                  searchedCodes={searchedCodes} 
                />
              </>
            ) : searchedCodes.length > 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-500">No se encontraron documentos para los códigos ingresados</p>
              </div>
            ) : null}
          </>
        ) : (
          <PDFExplorer documents={documents} onOpenPDF={handlePrintPDF} />
        )}
      </div>
    </div>
  );
};

export default App;

// DONE