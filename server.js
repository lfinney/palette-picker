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
    palettes: [
      {
        id: 1,
        color1: "6da34d",
        color2: "4573ae",
        color3: "2f487f",
        color4: "f6ae2d",
        color5: "f26419"
      },
      {
        id: 2,
        color1: "111111",
        color2: "4573ae",
        color3: "000000",
        color4: "f6ae2d",
        color5: "ffffff"
      }
    ]
  },
  {
    id: 'b2',
    palettes: [
      {
        id: 1,
        color1: "5ea56d",
        color2: "1623ae",
        color3: "2f487f",
        color4: "f7ae4d",
        color5: "f23419"
      }
    ]
  }
];

app.get('/api/v1/projects', (request, response) => {
  response.status(200).json(app.locals.projects)
});

app.get('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params;
  console.log(request.params);
  const project = app.locals.projects.find(project => project.id === id);

  if (project) {
    return response.status(200).json(project);
  } else {
    return response.sendStatus(404);
  }
})
