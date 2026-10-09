import { useState, useRef } from 'react';
import { parseCSV, createWord } from '../utils/csvParser.js';
import { saveList, generateId } from '../utils/storage.js';
import { useLists } from '../hooks/useLists.js';

export default function WordUpload({ onNavigate }) {
  const { lists, loading, refresh } = useLists();
  const [selectedListId, setSelectedListId] = useState('');
  const [newListName, setNewListName] = useState('');
  const [csvText, setCsvText] = useState('');
  const [previewWords, setPreviewWords] = useState(null);
  const [previewFields, setPreviewFields] = useState(null);
  const [manualFields, setManualFields] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const currentList = lists.find(l => l.id === selectedListId);

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setCsvText(evt.target.result);
      handleParseCSV(evt.target.result);
    };
    reader.readAsText(file);
  }

  function handleParseCSV(text = csvText) {
    setError('');
    setSuccess('');
    try {
      const { fields, words } = parseCSV(text);
      setPreviewFields(fields);
      setPreviewWords(words);
    } catch (err) {
      setError(err.message);
      setPreviewWords(null);
      setPreviewFields(null);
    }
  }

  async function handleSaveCSVWords() {
    if (!previewWords || !previewFields) return;
    setSaving(true);

    try {
      let list;
      if (currentList) {
        list = { ...currentList };
        const mergedFields = [...new Set([...list.fields, ...previewFields])];
        list.fields = mergedFields;
      } else {
        const name = newListName.trim() || 'My Word List';
        list = {
          id: generateId(),
          name,
          fields: previewFields,
          words: [],
          createdAt: Date.now(),
        };
      }

      const newWords = previewWords.map(w => ({ ...w, listId: list.id }));
      list.words = [...list.words, ...newWords];
      await saveList(list);
      await refresh();
      setSelectedListId(list.id);
      setPreviewWords(null);
      setPreviewFields(null);
      setCsvText('');
      setSuccess(`Added ${newWords.length} words to "${list.name}"`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setSaving(false);
    }
  }

  async function handleAddManualWord() {
    if (!currentList) {
      setError('Please select or create a list first');
      return;
    }
    const hasValue = Object.values(manualFields).some(v => v.trim());
    if (!hasValue) return;

    setSaving(true);
    try {
      const word = createWord(
        Object.fromEntries(
          currentList.fields.map(f => [f, (manualFields[f] || '').trim()])
        ),
        currentList.id
      );

      const list = { ...currentList };
      list.words = [...list.words, word];
      await saveList(list);
      await refresh();
      setManualFields({});
      setSuccess(`Added word to "${list.name}"`);
    } finally {
      setSaving(false);
    }
  }

  function handleCreateNewList() {
    const name = newListName.trim();
    if (!name) {
      setError('Enter a list name');
      return;
    }
    setError('Upload a CSV file to create a new list (the header row defines the fields)');
  }

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="word-upload">
      <div className="screen-header">
        <button className="btn btn-back" onClick={() => onNavigate('home')}>
          &larr; Back
        </button>
        <h2>Add Words</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* List selector */}
      <div className="section">
        <h3>Word List</h3>
        {lists.length > 0 && (
          <select
            value={selectedListId}
            onChange={e => {
              setSelectedListId(e.target.value);
              setError('');
              setSuccess('');
            }}
          >
            <option value="">-- New list (upload CSV) --</option>
            {lists.map(l => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.words.length} words)
              </option>
            ))}
          </select>
        )}
        {!selectedListId && (
          <input
            type="text"
            placeholder="New list name (e.g., Chinese HSK 1)"
            value={newListName}
            onChange={e => setNewListName(e.target.value)}
          />
        )}
      </div>

      {/* CSV Upload */}
      <div className="section">
        <h3>Upload CSV</h3>
        <p className="hint">
          First row = headers (e.g., <code>hanzi,pinyin,english</code>).
          Remaining rows = words.
        </p>
        <input
          type="file"
          accept=".csv,.txt"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        <div className="csv-manual-input">
          <textarea
            placeholder={`Paste CSV here, e.g.:\nhanzi,pinyin,english\n你好,nǐ hǎo,hello\n谢谢,xiè xie,thank you`}
            value={csvText}
            onChange={e => setCsvText(e.target.value)}
            rows={6}
          />
          <button className="btn btn-secondary" onClick={() => handleParseCSV()}>
            Parse CSV
          </button>
        </div>
      </div>

      {/* CSV Preview */}
      {previewWords && previewFields && (
        <div className="section">
          <h3>Preview ({previewWords.length} words)</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {previewFields.map(f => (
                    <th key={f}>{f}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewWords.slice(0, 20).map((w, i) => (
                  <tr key={i}>
                    {previewFields.map(f => (
                      <td key={f}>{w.fields[f]}</td>
                    ))}
                  </tr>
                ))}
                {previewWords.length > 20 && (
                  <tr>
                    <td colSpan={previewFields.length} className="hint">
                      ...and {previewWords.length - 20} more
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleSaveCSVWords}
            disabled={saving}
          >
            {saving ? 'Saving...' : `Save ${previewWords.length} Words`}
          </button>
        </div>
      )}

      {/* Manual entry (only if a list with fields exists) */}
      {currentList && (
        <div className="section">
          <h3>Add Word Manually</h3>
          <div className="manual-entry-form">
            {currentList.fields.map(f => (
              <input
                key={f}
                type="text"
                placeholder={f}
                value={manualFields[f] || ''}
                onChange={e =>
                  setManualFields({ ...manualFields, [f]: e.target.value })
                }
                onKeyDown={e => {
                  if (e.key === 'Enter') handleAddManualWord();
                }}
              />
            ))}
            <button
              className="btn btn-primary"
              onClick={handleAddManualWord}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Add Word'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
