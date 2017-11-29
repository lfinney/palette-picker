const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.use(express.static(__dirname + '/public'));

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
});

app.locals.projects = [
  {
    id: 'a1',
    title: 'Project 1'
  },
  {
    id: 'b2',
    title: 'Project 2'
  }
];

app.locals.palettes = [
  {
    id: 'a1',
    title: 'Cool Colors',
    colors: [
      '#123456',
      '#654321',
      '#fdacbe',
      '#ebcadf',
      '#123abc',
      '#def456'
    ],
    projectId: 'a1'
  }
]

app.get('/api/v1/projects', (request, response) => {
  response.status(200).json(app.locals.projects)
});

app.get('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params;
  const project = app.locals.projects.find(project => project.id === id);

  if (project) {
    return response.status(200).json(project);
  } else {
    return response.sendStatus(404);
  }
});

app.get('/api/v1/palettes', (request, response) => {
  response.status(200).json(app.locals.palettes)
});

app.get('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;
  const palette = app.locals.palettes.find(palette => palette.id === id);

  if (palette) {
    return response.status(200).json(palette);
  } else {
    return response.sendStatus(404);
  }
});

//what about /api/v1/projects/:id/palettes/:id
