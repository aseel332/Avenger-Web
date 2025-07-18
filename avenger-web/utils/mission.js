import { addDoc, collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

// missions.js
export async  function generateMissionsWithPositions(container) {
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const childSize = Math.max(containerWidth, containerHeight) * 0.1; // scale with container
  const safeDistance = childSize * 4;

  const placedPositions = [];

  function isInsideCircle(pos) {
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const radius = Math.min(containerWidth, containerHeight) / 2;

    const childCenterX = pos.x + childSize / 2;
    const childCenterY = pos.y + childSize / 2;

    return (childCenterX - centerX) ** 2 + (childCenterY - centerY) ** 2 <= (radius - childSize / 2) ** 2;
  }

  function isOverlapping(pos) {
    for (const p of placedPositions) {
      const dx = pos.x - p.x;
      const dy = pos.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < safeDistance) {
        return true;
      }
    }
    return false;
  }

  function generatePosition() {
    let pos;
    let attempts = 0;
    do {
      pos = {
        x: Math.random() * (containerWidth - childSize),
        y: Math.random() * (containerHeight - childSize)
      };
      attempts++;
      if (attempts > 1000) break;
    } while (!isInsideCircle(pos) || isOverlapping(pos));

    return pos;
  }

  // check local storage for same shape and use it
  const cacheKey = `missionPositions-${containerWidth}x${containerHeight}`;
  const cache = JSON.parse(localStorage.getItem(cacheKey));
  const now = Date.now();

   const missions = await getMissions() || [
    {
      name: "Thanos Snapped",
      color: "#A21010",
      type: "Critical",
      icon: "../src/assets/critical.png",
      description: "Today, In missouri, thanos landed in a cold ship. Bro decided to vanish half of the population ",
      location: "123.123.123",
      time: "Day",
      needed: 3
    },
    {
      name: "Ultron Detected",
      color: "yellow",
      type: "In-progress",
      icon: "../src/assets/in-progress.png",
      description: "So Ultron is a bitch ass mother fucker, he is  the biggest idion in the world, bro had acess to the entire internet but couldn't do shit. SUCH A FAILURE",
      location: "123.123.123",
      time: "Day",
      needed: 3
    },
    {
      name: "Maddock",
      color: "green",
      type: "Completed",
      icon: "../src/assets/green-tick.png",
      description: "Maddock is an idotic guy, he thinks he is the shit but he aint even a fart. Just deal with it and get over with it..",
      location: "123.123.123",
      time: "Day",
      needed: 3
    },
    {
      name: "Dr. Doom",
      color: "white",
      type: "Failed", 
      icon: "../src/assets/skull.png",
      description: "Tony Stark is the new Dr Doom, he is gonna fuck your ass up unless you hide it, I know you're gonna fail unless he decides to lose..",
      location: "123.123.123",
      time: "Day",
      needed: 3
    }
  ];




  if (cache && now - cache.timestamp < 5 * 60 * 1000 && cache.positions.length === missions.length) {
    cache.positions.forEach((pos, i) => {
      missions[i].position = pos;
    });
    return missions;
  }

  const positions = [];
  for (let i = 0; i < missions.length; i++) {
    const pos = generatePosition();
    positions.push(pos);
    missions[i].position = pos;
  }

  localStorage.setItem(cacheKey, JSON.stringify({
    timestamp: now,
    positions
  }));

  return missions;
}



export async function addMission(mission) {
  const missionRef = collection(db, "missions"); 
  const docRef = await addDoc(missionRef, mission);
  console.log("Missions added with Id: ", docRef.id);
  return docRef.id;
}

async function getMissions(){
  const querySnapShot = await getDocs(collection(db, "missions"));
  return querySnapShot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function deleteMission(id) {
  await deleteDoc(doc(db, "missions", id));
  
}

