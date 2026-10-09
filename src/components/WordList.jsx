import { useState } from 'react';
import { deleteList, deleteWord } from '../utils/storage.js';
import { getMasteryLevel, getMasteryColor } from '../utils/srs.js';
import { useLists } from '../hooks/useLists.js';

export default function WordList({ onNavigate }) {
  const { lists, loading, refresh } = useLists();
  const [selectedListId, setSelectedListId] = useState('');

  // Once lists load, auto-select the first one if nothing is selected
  const effectiveListId = selectedListId || lists[0]?.id || '';
  const currentList = lists.find(l => l.id === effectiveListId);

  async function handleDeleteWord(wordId) {
    await deleteWord(effectiveListId, wordId);
    await refresh();
  }

  async function handleDeleteList(listId) {
    if (!confirm('Delete this entire word list?')) return;
    await deleteList(listId);
    const updated = await refresh();
    setSelectedListId(updated[0]?.id || '');
  }

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="word-list-screen">
      <div className="screen-header">
        <button className="btn btn-back" onClick={() => onNavigate('home')}>
          &larr; Back
        </button>
        <h2>My Words</h2>
      </div>

      {lists.length === 0 ? (
        <div className="empty-state">
          <p>No word lists yet.</p>
          <button className="btn btn-primary" onClick={() => onNavigate('upload')}>
            Add Words
          </button>
        </div>
      ) : (
        <>
          <div className="list-selector">
            <select
              value={effectiveListId}
              onChange={e => setSelectedListId(e.target.value)}
            >
              {lists.map(l => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.words.length} words)
                </option>
              ))}
            </select>
            {currentList && (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteList(effectiveListId)}
              >
                Delete List
              </button>
            )}
          </div>

          {currentList && currentList.words.length > 0 && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    {currentList.fields.map(f => (
                      <th key={f}>{f}</th>
                    ))}
                    <th>Mastery</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {currentList.words.map(word => {
                    const mastery = getMasteryLevel(word);
                    const color = getMasteryColor(mastery);
                    return (
                      <tr key={word.id}>
                        {currentList.fields.map(f => (
                          <td key={f}>{word.fields[f]}</td>
                        ))}
                        <td>
                          <span
                            className="mastery-badge"
                            style={{ backgroundColor: color }}
                          >
                            {mastery}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteWord(word.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {currentList && currentList.words.length === 0 && (
            <p className="hint">This list is empty.</p>
          )}
        </>
      )}
    </div>
  );
}
