/* eslint-disable */

exports.seed = function(knex, Promise) {
  return knex('palettes').del() //delete palletes
    .then( () => knex('projects').del() ) //delete porjects
    .then( () => {
      return Promise.all([
        knex('projects').insert({
          id: 1,
          name: 'Star Wars'
        }, 'id')
        .then( project => {
          return knex('palettes').insert([
            {
            id: 1,
            name: 'Lightsabers',
            color1: '#2ff923',
            color2: '#dd0048',
            color3: '#551a8b',
            color4: '#2719c7',
            color5: '#ff9933',
            projectId: project[0]
            },
            {
            id: 2,
            name: 'Rebel Alliance',
            color1: '#ae0000',
            color2: '#007ce6',
            color3: '#2de3a2',
            color4: '#a36520',
            color5: '#494949',
            projectId: project[0]
            }
          ])
        })
        .then( project => console.log('Seeding complete'))
        .catch( error => console.log(`Error seeding data: ${error}`))
      ]);
    })
    .catch( error => console.log(`Error seeding data: ${error}`))
};
