const pageLoad = () => {
  fetchProjects();
  rollColors();
};

const fetchProjects = () => {
  fetch('/api/v1/projects')
    .then(response => response.json())
    .then(fetchedProjects => {
      appendProject(fetchedProjects);
      fetchPalettes(fetchedProjects);
    })
    .catch(error => console.log(error))
};

const fetchPalettes = (projects) => {
  projects.forEach( project => {
    fetch(`/api/v1/projects/${project.id}/palettes`)
    .then(response => response.json())
    .then(palettes => appendPalettes(palettes))
  });
}

const appendProject = (projects) => {
  projects.forEach( project => {
    $('.user-palettes').append(
      `<div id="project-template" class="project project-${project.id}">
        <h3 class="project-name" contenteditable="true">${project.name}</h3>
      </div>`
    )
  });
};

const appendPalettes = (palettes) => {
  palettes.forEach( palette => {
    $(`.project-${palette.projectId}`).append(`
      <div id="saved-palette-template">
        <div class="saved-palette-colors">
          <div class="palette-title" contenteditable="true">${palette.name}</div>
          <div class="small-color-container">
            <div class="small-palette-color small-palette-left" style="background-color: ${palette.color1}"></div>
            <div class="small-palette-color" style="background-color: ${palette.color2}"></div>
            <div class="small-palette-color" style="background-color: ${palette.color3}"></div>
            <div class="small-palette-color" style="background-color: ${palette.color4}"></div>
            <div class="small-palette-color small-palette-right" style="background-color: ${palette.color5}"></div>
          </div>
        </div>
        <button class="remove-palette-button">X</button>
      </div>
    `);
  });
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
  }
}


$(document).ready(pageLoad);
$('.roll-colors-button').on('click', rollColors);
$('.create-project-button').on('click', appendProject);
$('.save-palette-button').on('click', appendPalettes);
