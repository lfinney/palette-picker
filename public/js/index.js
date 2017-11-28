$('.create-project-button').on('click', createProject);
$('.save-palette-button').on('click', createPalette);

function createProject() {
  const template = $('#project-template').clone();
  console.log(template);
  $('.user-palettes').append(template)
}

function createPalette() {
  const template = $('#saved-palette-template').clone();
  $('.user-palettes').append(template)
}
