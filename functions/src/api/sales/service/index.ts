import { firebase } from './../../../utils/firebase';
import * as admin from 'firebase-admin';

import { getCommodity } from '../../commodities/service';

const collection = 'sales';

const createdTimestamp = admin.firestore.FieldValue.serverTimestamp();
const auditField = {
  timestamp: createdTimestamp,
};

export const getSales = async () => {
  const data: any[] = [];
  const snapshot = await firebase.collection(collection).get();
  snapshot.forEach((element) => {
    data.push({
      id: element.id,
      ...element.data(),
    });
  });
  return data || [];
};

export const getSale = async (id: any) => {
  const data = await firebase.collection(collection).doc(id).get();

  if (!data.exists) return [];

  const sale = data?.data();
  const commodity = await getCommodity(sale?.commodityId);

  const composedData = {
    ...sale,
    commodityId: commodity,
  };
  return composedData;
};

export const createSale = async (item: any) => {
  const data = await firebase
    .collection(collection)
    .add({ ...item, ...auditField });
  return data.id;
};

export const updateSale = async (id: any, item: any) => {
  const data = await firebase
    .collection(collection)
    .doc(id)
    .update({ ...item, ...auditField });
  return data.writeTime;
};

export const deleteSale = async (id: any) => {
  const data = await firebase.collection(collection).doc(id).delete();
  return data.writeTime;
};
