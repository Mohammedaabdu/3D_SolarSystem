export const SunMeasurments = {
  name: "sun",
  texturePath: "./Sun/2k_sun.jpg",
  orbitDuration: 8.8, // days
  rotationDuration: 58.6, // days
  orbitRadius: 200, // arbitrary units
  radius: 50,
};
export const mercuryMeasurments = {
  name: "mercury",
  texturePath: "./Mercury/2k_mercury.jpg",
  orbitDuration: 8.8, // days
  rotationDuration: 58.6, // days
  orbitRadius: 200, // arbitrary units
  radius: 15,
  orbitColor: "#714e81",
};
export const venusMeasurments = {
  name: "Venus",
  texturePath: "./Venus/2k_venus_surface.jpg",
  orbitDuration: 22.5, // days
  rotationDuration: 24.3, // days
  orbitRadius: 400, // arbitrary units
  radius: 30,
  orbitColor: "#845b13",
};
export const earthMeasurments = {
  name: "Earth",
  texturePath: "./Earth/2k_earth_daymap.jpg",
  orbitDuration: 36.5, // days
  rotationDuration: 10, // days
  orbitRadius: 600, // arbitrary units
  radius: 35,
  moonMeasurments: {
    name: "Moon",
    texturePath: "./Moon/2k_moon.jpg",
    orbitDuration: 40.5, // days
    rotationDuration: 25, // days
    orbitRadius: 650, // arbitrary units
    radius: 15,
  },
  orbitColor: "#1374bb",
};
export const marsMeasurments = {
  name: "Mars",
  texturePath: "./Mars/2k_mars.jpg",
  orbitDuration: 68.7, // days
  rotationDuration: 1.03, // days
  orbitRadius: 800, // arbitrary units
  radius: 30,
  orbitColor: "#bb5f13",
};
export const jupiterMeasurments = {
  name: "Jupiter",
  texturePath: "./Jupiter/2k_jupiter.jpg",
  orbitDuration: 433.3, // days
  rotationDuration: 4.1, // days
  orbitRadius: 1000, // arbitrary units
  radius: 30,
  orbitColor: "#bb9e13",
};
export const saturnMeasurments = {
  name: "Saturn",
  texturePath: "./Saturn/2k_saturn.jpg",
  orbitDuration: 107.59, // days
  rotationDuration: 4.4, // days
  orbitRadius: 1200, // arbitrary units
  radius: 30,
  orbitColor: "#d2bb13",
  planetRing: {
    ringTexturePath: "./Saturn/2k_saturn_ring_alpha.png",
    radiusInner: 45,
    radiusOuter: 50,
  },
};
export const uranusMeasurments = {
  name: "Uranus",
  texturePath: "./Uranus/2k_uranus.jpg",
  orbitDuration: 206.87, // days
  rotationDuration: 7.2, // days
  orbitRadius: 1400, // arbitrary units
  radius: 30,
  orbitColor: "#13bbd5",
};
export const neptuneMeasurments = {
  name: "Neptune",
  texturePath: "./Neptune/2k_neptune.jpg",
  orbitDuration: 301.9, // days
  rotationDuration: 6.7, // days
  orbitRadius: 1600, // arbitrary units
  radius: 30,
  orbitColor: "#1348bb",
};
