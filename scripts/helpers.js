// Helper to define snippets cleanly
function createSnippet(title, conceptId, code, notes) {
  return {
    title,
    concept_id: conceptId,
    code: code.trim(),
    notes: notes.trim()
  };
}

module.exports = { createSnippet };
