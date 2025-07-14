// missions.js
export function generateMissionsWithPositions(container) {
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

