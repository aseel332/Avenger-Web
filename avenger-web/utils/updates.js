import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

export async function loadUpdates(){
  const q = query(
      collection(db, "updates"),
      orderBy("inside", "desc")
    );
  const querySnapShot = await  getDocs(q);
    return querySnapShot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
}

