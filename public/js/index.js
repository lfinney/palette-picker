$('.create-palette-button').on('click', createPalette);

function createPalette() {
  const template = $('#saved-palette-template').clone();
  console.log(template);
  $('.user-palettes').append(template)
}
