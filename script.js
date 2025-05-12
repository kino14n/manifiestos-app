/**
 * Encuentra el conjunto mínimo de documentos (manifiestos) que cubra todos los códigos,
 * priorizando recencia y recurriendo al histórico solo si es necesario.
 * @param {Array<string>} codes - Lista de códigos a cubrir.
 * @param {Array<Object>} allDocs - Lista de documentos con { name, codes, date }.
 * @param {number} recentDays - Número de días para considerar recientes.
 * @returns {Array<Object>} Documentos seleccionados.
 */
function findOptimalDocuments(codes, allDocs, recentDays) {
  const isRecent = doc => {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - recentDays);
    return new Date(doc.date) >= threshold;
  };
  const coversAll = (doc, codesList) => codesList.every(code => doc.codes.includes(code));

  // 1. Cobertura total en documentos recientes
  const recentDocs = allDocs.filter(isRecent);
  const fullRecent = recentDocs.filter(doc => coversAll(doc, codes));
  if (fullRecent.length) {
    return [ fullRecent.sort((a,b) => new Date(b.date) - new Date(a.date))[0] ];
  }

  // 2. Cobertura total en todo el histórico
  const fullAll = allDocs.filter(doc => coversAll(doc, codes));
  if (fullAll.length) {
    return [ fullAll.sort((a,b) => new Date(b.date) - new Date(a.date))[0] ];
  }

  // 3. Fallback voraz (greedy)
  let remaining = [...codes];
  let available = [...allDocs];
  const selected = [];
  while (remaining.length) {
    const candidates = available.map(doc => ({
      doc,
      count: remaining.filter(code => doc.codes.includes(code)).length
    })).filter(item => item.count > 0);
    if (!candidates.length) break;
    candidates.sort((a, b) => b.count - a.count || (new Date(b.doc.date) - new Date(a.doc.date)));
    const best = candidates[0].doc;
    selected.push(best);
    remaining = remaining.filter(code => !best.codes.includes(code));
    available = available.filter(doc => doc.name !== best.name);
  }
  return selected;
}

/**
 * Maneja el formulario de entrada y muestra el resultado
 */
document.getElementById('manifestForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const codesInput = document.getElementById('codes').value;
  const codes = codesInput.split(',').map(s => s.trim()).filter(s => s);
  const recentDays = parseInt(document.getElementById('recentDays').value, 10);
  const fileInput = document.getElementById('docsFile');
  if (!fileInput.files.length) {
    alert('Selecciona un archivo JSON con los datos de manifiestos');
    return;
  }
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const allDocs = JSON.parse(event.target.result);
      const selected = findOptimalDocuments(codes, allDocs, recentDays);
      const list = document.getElementById('selectedList');
      list.innerHTML = '';
      if (selected.length) {
        selected.forEach(doc => {
          const li = document.createElement('li');
          li.textContent = `${doc.name} (Fecha: ${doc.date})`;
          list.appendChild(li);
        });
      } else {
        list.innerHTML = '<li>No se encontraron documentos que cubran todos los códigos.</li>';
      }
    } catch (err) {
      alert('Error al parsear JSON: ' + err);
    }
  };
  reader.readAsText(file);
});
