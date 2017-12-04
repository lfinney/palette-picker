const appendProjectSelector = (project) => {
  $('.project-dropdown')
    .append(`<option value="${project.id}">${project.name}</option>`);
};

const appendProject = (projects) => {
  projects.forEach((project) => {
    appendProjectSelector(project);
    $('.user-palettes')
      .append(`<div id="project-template" class="project project-${project.id}">
        <h3 class="project-name">${project.name}</h3>
      </div>`);
  });
};

const appendPalettes = (palettes) => {
  if (palettes.length) {
    palettes.forEach((palette) => {
      $(`.project-${palette.projectId}`).append(`
        <div id="palette-${palette.id}" class="palette" data-id="${palette.id}">
          <div class="saved-palette-colors">
            <div class="palette-title">${palette.name}</div>
            <div class="small-color-container">
              <div class="small-palette-color sc1 small-palette-left" style="background-color: ${palette.color1}"></div>
              <div class="small-palette-color sc2" style="background-color: ${palette.color2}"></div>
              <div class="small-palette-color sc3" style="background-color: ${palette.color3}"></div>
              <div class="small-palette-color sc4" style="background-color: ${palette.color4}"></div>
              <div class="small-palette-color sc5 small-palette-right" style="background-color: ${palette.color5}"></div>
            </div>
          </div>
          <button class="remove-palette-button">X</button>
        </div>
      `);
    });
  }
};

function componentToHex(color) {
  const hex = (+color).toString(16);
  const newHex = hex.length === 1 ? '0' + hex : hex;
  return newHex;
}

function rgbToHex(rgb) {
  const rgbArray = rgb.split('(')[1].split(')')[0].split(', ');
  return '#' + componentToHex(rgbArray[0]) +
    componentToHex(rgbArray[1]) + componentToHex(rgbArray[2]);
}

const fetchPalettes = (projects) => {
  projects.forEach((project) => {
    fetch(`/api/v1/projects/${project.id}/palettes`)
      .then(response => response.json())
      .then(palettes => appendPalettes(palettes));
  });
};

const generateRandomColor = () => {
  const letters = '0123456789abcdef';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const rollColors = () => {
  for (let i = 1; i < 6; i++) {
    const color = generateRandomColor();
    if (!$(`.color${i}`).hasClass('locked')) {
      $(`.color${i}`).css('background-color', color);
      $(`.color-container .color${i} .color-text`).text(color);
    }
  }
};

const postProject = (projectTitle) => {
  fetch('/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify({ name: projectTitle }),
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(project => appendProject(project))
    .catch(error => console.log(error));
};

const checkProjectName = () => {
  const projectTitle = $('.create-project-input').val();

  fetch('/api/v1/projects/')
    .then(response => response.json())
    .then((projects) => {
      const match = projects.find(project => projectTitle === project.name);
      if (!match) {
        postProject(projectTitle);
        $('.create-project-input').val('');
      } else {
        alert('You must use a unique project name.');
      }
    });
};

const setToUnlocked = () => {
  for (let i = 1; i < 6; i++) {
    const palette = $('.main-palette').find(`.color${i}`);
    palette.find('img').attr('src', './assets/unlock.svg');
    palette.removeClass('locked');
  }
};

const postPalette = () => {
  const newPalette = {
    name: $('.palette-name').val(),
    color1: $('.color1').css('background-color'),
    color2: $('.color2').css('background-color'),
    color3: $('.color3').css('background-color'),
    color4: $('.color4').css('background-color'),
    color5: $('.color5').css('background-color')
  };
  const projectId = $('.project-dropdown').find('option:selected').prop('value');

  fetch(`/api/v1/projects/${projectId}/palettes`, {
    method: 'POST',
    body: JSON.stringify(newPalette),
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(palette => appendPalettes(palette))
    .catch(error => console.log(error));
  setToUnlocked();
  $('.palette-name').val('');
  $('.project-dropdown').val($('.project-dropdown option:first').val());
};

const deletePalette = (eventTarget) => {
  const paletteId = $(eventTarget).closest('.palette').attr('data-id');

  fetch(`/api/v1/palettes/${paletteId}`, {
    method: 'DELETE'
  })
    .catch(error => console.log(error));

  $(eventTarget).closest('.palette').remove();
};

const fetchProjects = () => {
  fetch('/api/v1/projects')
    .then(response => response.json())
    .then((fetchedProjects) => {
      appendProject(fetchedProjects);
      fetchPalettes(fetchedProjects);
    })
    .catch(error => console.log(error));
};


const pageLoad = () => {
  fetchProjects();
  rollColors();
};

const toggleLock = (target) => {
  const lock = $(target);
  console.log(lock);
  if (lock.attr('src') === './assets/unlock.svg') {
    lock.attr('src', './assets/lock.svg');
    lock.closest('.color').addClass('locked');
  } else {
    lock.attr('src', './assets/unlock.svg');
    lock.closest('.color').removeClass('locked');
  }
};

const loadMainPalette = (eventTarget) => {
  const palette = eventTarget.closest('.saved-palette-colors');

  for (let i = 1; i < 6; i++) {
    const smallColor = $(palette).find(`.sc${i}`).css('background-color');
    $(`.color${i}`).css('background-color', smallColor);
    $(`.color-container .color${i} .color-text`).text(rgbToHex(smallColor));
  }
};

$(document).ready(pageLoad);
$('.roll-colors-button').on('click', rollColors);
$('.save-palette-button').on('click', postPalette);
$('.create-project-button').on('click', checkProjectName);
$('.user-palettes').on('click', '.remove-palette-button', (event => deletePalette(event.target)));
$('.main-palette').on('click', '.lock', event => toggleLock(event.target));
$('.user-palettes').on('click', '.saved-palette-colors', event => loadMainPalette(event.target));
