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

export const getSinglePalette = (id) => {

};

export const loadOfflinePalettes = () => {

};

//import using a script tag in html
//we need
  // New palette or project save to IDB
  // Post it to server
  //
  // If offline, load from IDB
    // multiple ways to detect online offline status; best solution might be to
    // check for successful 200 request and if it fails pass to load from
    // indexedDB
