import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";

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

if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).__gostoTest = async () => {
    try {
      const ref = await addDoc(collection(db, "orders"), {
        test: true,
        time: new Date(),
        restaurantId: RESTAURANT_ID,
      });
      console.log("✅ WRITE SUCCESS — doc id:", ref.id);
      return ref.id;
    } catch (err) {
      console.error("❌ ERROR:", err);
      throw err;
    }
  };
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
  const detailsCombined = [
    input.clientName ? `الاسم: ${input.clientName}` : "",
    input.details ? input.details : "",
  ]
    .filter(Boolean)
    .join(" | ");

  const orderObj = {
    restaurantId: RESTAURANT_ID,
    clientName: input.clientName,
    clientPhone: input.clientPhone,
    clientAddress: input.clientAddress,
    details: detailsCombined,
    items: input.items,
    total: input.total,
    status: "new",
    timestamp: serverTimestamp(),
    seen: false,
    visible: false,
  };

  const ref = await addDoc(collection(db, "orders"), orderObj);
  return ref.id;
}
