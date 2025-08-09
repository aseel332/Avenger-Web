import { collection,  getDocs } from "firebase/firestore"
import { db } from "../firebase"
 


export async function getUsers(){
  const querySnapShot = await getDocs(collection(db, "users"));
  return querySnapShot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

export async function getAvengers(){
  return await getUsers();
}