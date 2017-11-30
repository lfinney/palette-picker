const pageLoad = () => {
  fetchProjects();
  rollColors();
};

const fetchProjects = () => {
  fetch('/api/v1/projects')
    .then(response => response.json())
    .then(fetchedProjects => {
      appendProjectSelector(fetchedProjects);
      appendProject(fetchedProjects);
      fetchPalettes(fetchedProjects);
    })
    .catch(error => console.log(error))
};

const fetchPalettes = (projects) => {
  projects.forEach(project => {
    fetch(`/api/v1/projects/${project.id}/palettes`)
    .then(response => response.json())
    .then(palettes => appendPalettes(palettes))
  });
};

const appendProjectSelector = (projects) => {
  projects.forEach(project => {
    $('.project-dropdown').append(
      `<option value="${project.id}">${project.name}</option>`
    );
  });
};

const appendProject = (projects) => {
  projects.forEach(project => {
    $('.user-palettes').append(
      `<div id="project-template" class="project project-${project.id}">
        <h3 class="project-name" contenteditable="true">${project.name}</h3>
      </div>`
    );
  });
};

const appendPalettes = (palettes) => {
  palettes.forEach(palette => {
    $(`.project-${palette.projectId}`).append(`
      <div id="palette-${palette.id}"class="palette" data-id="${palette.id}">
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

const postProject =() => {
  const projectTitle = $('.create-project-input').val();
  fetch('/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify({name: projectTitle}),
    headers: {
      'content-type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(project => appendProject(project))
  .catch(error => console.log(error))
}

const postPalette = () => {
  const newPalette = {
    name: $('.palette-name').val(),
    color1: $('.color1').css('background-color'),
    color2: $('.color2').css('background-color'),
    color3: $('.color3').css('background-color'),
    color4: $('.color4').css('background-color'),
    color5: $('.color5').css('background-color')
  };
  const projectId = $('.project-dropdown').find( "option:selected").prop("value")

  fetch(`/api/v1/projects/${projectId}/palettes`, {
    method: 'POST',
    body: JSON.stringify(newPalette),
    headers: {
      'content-type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(palette => appendPalettes(palette))
  .catch(error => console.log(error))
}

const deletePalette = (eventTarget) => {
  const paletteId = $(eventTarget).closest('.palette').attr('data-id');

  fetch(`/api/v1/palettes/${paletteId}`, {
    method: 'DELETE'
  })
  // .then( () => $(`#project-${paletteId}`).remove())
  .catch(error => console.log(error))

  $(eventTarget).closest('.palette').remove();
}

$(document).ready(pageLoad);
$('.roll-colors-button').on('click', rollColors);
$('.save-palette-button').on('click', postPalette);
$('.create-project-button').on('click', postProject)
$('.user-palettes').on('click', '.remove-palette-button', (event) => deletePalette(event.target))
