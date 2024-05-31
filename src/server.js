import { db } from './firebase';
import { updateDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';

async function UpdateData(collection, docId, data, message, functionToRun) {
    try {
        await updateDoc(doc(db, collection, docId), data);
        if (message)
            alert(message);
        functionToRun();
    } catch (err) {
        console.log(err);
    }
}

async function Create(collection, docId, data, message, functionToRun) {
    try {
        await setDoc(doc(db, collection, docId), data);
        if (message)
            alert(message);
        functionToRun();
    } catch (err) {
        console.log(err);
    }
}

async function RemoveDoc(collection, docId) {
    try {
        await deleteDoc(doc(db, collection, docId));
    } catch (err) {
        console.log(err);
    }
}

export const updateData = UpdateData;
export const create = Create;
export const removeDoc = RemoveDoc;