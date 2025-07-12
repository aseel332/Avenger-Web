export const headlines = [
  "MODOK hacks into air traffic control across Europe — flights grounded, skies silent.",
    "Kang the Conqueror destabilizes timelines — New York experiences 3 different centuries in one hour.",
    "Ultron hijacks global satellite network — broadcasts countdown with no explanation.",
    "Doctor Doom seizes control of the Latverian nuclear arsenal — global powers on high alert.",
    "Loki's mischief causes reality to warp — citizens report seeing mythical creatures in everyday life.",
    "Thanos collects all Infinity Stones — universe-wide snap imminent, heroes scramble.",
    "Green Goblin unleashes new chemical agent — entire city block transformed into pumpkin patch.",
    "Magneto reverses Earth's magnetic poles — compasses spin wildly, global navigation chaos.",
    "Red Skull unearths ancient artifact — whispers of a new HYDRA world order begin to spread.",
    "Galactus arrives on Earth's orbit — heralds begin planetary consumption, last stand begins.",
    "Mystique infiltrates world leaders' summit — critical decisions made with unknown motives.",
    "Venom symbiote outbreak reported — citizens bond with alien life, chaos erupts in streets.",
    "Apocalypse awakens ancient mutants — new era of survival of the fittest declared."
];

export function getFirstThreeHeadlines(){
  return headlines.filter((headline, headlineIndex) => {
    return headlineIndex < 3;
  })
  
}

