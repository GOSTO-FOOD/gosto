import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, type Firestore } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBJ07Cw8N4Mo7Dq86iBijp3Wf2LQwOKqG8",
  authDomain: "restaurant-manager-efa66.firebaseapp.com",
  projectId: "restaurant-manager-efa66",
  storageBucket: "restaurant-manager-efa66.appspot.com",
  messagingSenderId: "867057829541",
  appId: "1:867057829541:web:d5fc2fafa5434d78772f4c",
};

export const RESTAURANT_ID = "gosto_food";

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

export async function getMenuImageUrl(path: string): Promise<string | null> {
  try {
    const imageRef = ref(storage, path);
    const url = await getDownloadURL(imageRef);
    return url;
  } catch {
    return null;
  }
}

export interface OrderItemPayload {
  group: string;
  name: string;
  size: string | null;
  price: number;
  qty: number;
}

export interface SubmitOrderInput {
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  details?: string;
  items: OrderItemPayload[];
  total: number;
}

export async function submitOrder(input: SubmitOrderInput): Promise<string> {
  const order = {
    restaurantId: RESTAURANT_ID,
    customerName: input.clientName,
    customerPhone: input.clientPhone,
    deliveryAddress: input.clientAddress,
    notes: input.details ?? null,
    items: input.items,
    totalAmount: input.total,
    status: "pending",
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "orders"), order);
  return docRef.id;
}
