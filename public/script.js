/**
 * Encuentra el conjunto mínimo de documentos (manifiestos) que cubra todos los códigos,
 * priorizando recencia y recurriendo al histórico solo si es necesario.
 * @param {Array<string>} codes - Lista de códigos a cubrir.
 * @param {Array<Object>} allDocs - Lista de documentos con { name, codes, date }.
 * @param {function(Object): boolean} isRecent - Función para identificar documentos recientes.
 * @returns {Array<Object>} Documentos seleccionados.
 */
function findOptimalDocuments(codes, allDocs, isRecent) {
  const coversAll = (doc, codesList) => codesList.every(code => doc.codes.includes(code));

  // 1. Cobertura total en recientes
  const recentDocs = allDocs.filter(isRecent);
  const fullRecent = recentDocs.filter(doc => coversAll(doc, codes));
  if (fullRecent.length) {
    return [ fullRecent.sort((a,b) => b.date - a.date)[0] ];
  }

  // 2. Cobertura total en todo histórico
  const fullAll = allDocs.filter(doc => coversAll(doc, codes));
  if (fullAll.length) {
    return [ fullAll.sort((a,b) => b.date - a.date)[0] ];
  }

  // 3. Fallback voraz
  let remaining = [...codes];
  let docs = [...allDocs];
  const selected = [];

  while (remaining.length > 0) {
    const candidates = docs
      .map(doc => {
        const count = remaining.filter(code => doc.codes.includes(code)).length;
        return { doc, count };
      })
      .filter(item => item.count > 0);

    candidates.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return b.doc.date - a.doc.date;
    });

    const best = candidates[0].doc;
    selected.push(best);
    remaining = remaining.filter(code => !best.codes.includes(code));
    docs = docs.filter(doc => doc.name !== best.name);
  }

  return selected;
}

// Export if module system present
if (typeof module !== 'undefined') {
  module.exports = { findOptimalDocuments };
}
