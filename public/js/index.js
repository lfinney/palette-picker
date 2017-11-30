const pageLoad = () => {
  fetchProjects();
  rollColors();
};

const fetchProjects = () => {
  fetch('/api/v1/projects')
    .then( response => response.json())
    .then( fetchedProjects => {
      fetchPalettes(fetchedProjects);
    })
    .catch( error => console.log(error))
};

const fetchPalettes = (projects) => {

}

const createProject = () => {
  const template = $('#project-template').clone();
  console.log(template);
  $('.user-palettes').append(template)
};

const createPalette = () => {
  const template = $('#saved-palette-template').clone();
  $('.project').append(template)
};

const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const rollColors = () => {
  for(let i = 1; i < 6; i ++) {
    let color = generateRandomColor();
    $(`.color${i}`).css('background-color', color);
    $(`.color-container .color${i} .color-text`).text(color);
    console.log(color);
  }
}


$(document).ready(pageLoad);
$('.roll-colors-button').on('click', rollColors);
$('.create-project-button').on('click', createProject);
$('.save-palette-button').on('click', createPalette);
