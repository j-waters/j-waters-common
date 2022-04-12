import { DocumentType, Ref } from '@typegoose/typegoose';
import { AssertionError } from 'assert';
import mongoose, { Types } from 'mongoose';

export function isDoc<T>(doc: T | Ref<T>): doc is DocumentType<T> {
    return doc instanceof mongoose.Document;
}

export function isDocArray<T>(docs: (T | Ref<T>)[]): docs is DocumentType<T>[] {
    return Array.isArray(docs) && docs.every(isDoc);
}

export function assertIsDoc<T>(
    doc: T | Ref<T>,
): asserts doc is DocumentType<Exclude<T, Types.ObjectId>> {
    if (isDoc(doc)) {
        return;
    }
    throw new AssertionError({ message: 'Not a document' });
}

export function assertIsDocArray<T>(
    docs: (T | Ref<T>)[],
): asserts docs is DocumentType<T>[] {
    if (isDocArray(docs)) {
        return;
    }
    throw new AssertionError({ message: 'Not a document array' });
}

export function asDoc<T>(
    doc: T | Ref<T>,
): DocumentType<Exclude<T, Types.ObjectId>> {
    assertIsDoc<T>(doc);
    return doc;
}

export function asDocArray<T>(docs: (T | Ref<T>)[]): DocumentType<T>[] {
    assertIsDocArray<T>(docs);
    return docs;
}

export function getId(doc: Ref<{ id: string }>): string {
    return isDoc(doc) ? doc.id.toString() : doc?.toString();
}

// export function getObjectId(doc: Ref<{ id: string }>): Types.ObjectId {
//     return new mongoose.Types.ObjectId(getId(doc));
// }
