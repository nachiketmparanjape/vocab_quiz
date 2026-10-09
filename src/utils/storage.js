import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { db, getUid } from './firebase.js';

function listsCol() {
  return collection(db, 'users', getUid(), 'lists');
}

function listDoc(listId) {
  return doc(db, 'users', getUid(), 'lists', listId);
}

export async function loadLists() {
  try {
    const snapshot = await getDocs(listsCol());
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
}

export async function saveLists(lists) {
  const batch = writeBatch(db);
  for (const list of lists) {
    batch.set(listDoc(list.id), list);
  }
  await batch.commit();
}

export async function saveList(list) {
  await setDoc(listDoc(list.id), list);
}

export async function deleteList(listId) {
  await deleteDoc(listDoc(listId));
}

export async function deleteWord(listId, wordId) {
  const lists = await loadLists();
  const list = lists.find((l) => l.id === listId);
  if (list) {
    list.words = list.words.filter((w) => w.id !== wordId);
    await setDoc(listDoc(listId), list);
  }
}

export async function updateWord(listId, updatedWord) {
  const lists = await loadLists();
  const list = lists.find((l) => l.id === listId);
  if (list) {
    const idx = list.words.findIndex((w) => w.id === updatedWord.id);
    if (idx >= 0) {
      list.words[idx] = updatedWord;
      await setDoc(listDoc(listId), list);
    }
  }
}

export function generateId() {
  return doc(collection(db, '_')).id;
}
