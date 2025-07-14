// missions.js
const CONTAINER_WIDTH = 600;
const CONTAINER_HEIGHT = 400;
const CHILD_SIZE = 80; // larger popups
const SAFE_DISTANCE = 90; // increase spacing

const LEFT_OFFSET = 50; // shift all positions to right
const TOP_OFFSET = 0;  // shift all positions downward

function isInsideCircle(pos) {
  const centerX = CONTAINER_WIDTH / 2;
  const centerY = CONTAINER_HEIGHT / 2;
  const radius = CONTAINER_WIDTH / 2;

  const childCenterX = pos.x + CHILD_SIZE / 2;
  const childCenterY = pos.y + CHILD_SIZE / 2;

  return (childCenterX - centerX) ** 2 + (childCenterY - centerY) ** 2 <= (radius - CHILD_SIZE / 2) ** 2;
}

function isOverlapping(pos, placed) {
  for (const p of placed) {
    const dx = pos.x - p.x;
    const dy = pos.y - p.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < SAFE_DISTANCE) {
      return true;
    }
  }
  return false;
}

function generatePosition(placed) {
  let pos;
  let attempts = 0;
  do {
    pos = {
      x: LEFT_OFFSET + Math.random() * (CONTAINER_WIDTH - CHILD_SIZE),
      y: TOP_OFFSET + Math.random() * (CONTAINER_HEIGHT - CHILD_SIZE)
    };
    attempts++;
    if (attempts > 1000) break;
  } while (!isInsideCircle(pos) || isOverlapping(pos, placed));

  return pos;
}

function getPositions(missionCount) {
  const cache = JSON.parse(localStorage.getItem('missionPositions'));
  const now = Date.now();

  if (cache && now - cache.timestamp < 5 * 60 * 1000 && cache.positions.length === missionCount) {
    return cache.positions;
  }

  const positions = [];
  for (let i = 0; i < missionCount; i++) {
    const pos = generatePosition(positions);
    positions.push(pos);
  }

  localStorage.setItem('missionPositions', JSON.stringify({
    timestamp: now,
    positions
  }));

  return positions;
}

const missions = [
  {
    name: "Thanos Snapped",
    color: "#A21010",
    icon: "../src/assets/critical.png",
    description: "NFR#iriuOIen e#Iubbf3rnfnui 3fb23unfuir if32nfin2uifn 9if3rhbgbi4r"
  },
  {
    name: "Thanos Snapped",
    color: "#A21010",
    icon: "../src/assets/critical.png",
    description: "NFR#iriuOIen e#Iubbf3rnfnui 3fb23unfuir if32nfin2uifn 9if3rhbgbi4r"
  },
  {
    name: "Thanos Snapped",
    color: "#A21010",
    icon: "../src/assets/critical.png",
    description: "NFR#iriuOIen e#Iubbf3rnfnui 3fb23unfuir if32nfin2uifn 9if3rhbgbi4r"
  },
  {
    name: "Thanos Snapped",
    color: "#A21010",
    icon: "../src/assets/critical.png",
    description: "NFR#iriuOIen e#Iubbf3rnfnui 3fb23unfuir if32nfin2uifn 9if3rhbgbi4r"
  }
];

const positions = getPositions(missions.length);
missions.forEach((mission, i) => {
  mission.position = positions[i];
});

export { missions };
