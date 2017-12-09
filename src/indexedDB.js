import Dexie from 'dexie';

let db = new Dexie('palettePicker');

db.version(1).stores({
  projects: 'id, name',
  palettes: 'id, name, color1, color2, color3, color4, color5, projectId'
});

export const saveOfflineProjects = (project) => {
  return db.projects.add(project);
};

export const saveOfflinePalettes = (palette) => {
  return db.palettes.add(palette);
};

// export const getSinglePalette = (id) => {
//   return db.palettes.get(parseInt(id));
// };

export const loadOfflineProjects = () => {
  return db.projects.toArray();
};

export const loadOfflinePalettes = () => {
  return db.palettes.toArray();
};
