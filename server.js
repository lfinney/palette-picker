const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const httpsRedirect = (request, response, next) => {
  if (request.header('x-forwarded-proto') !== 'https') {
    return response.redirect(`https://${request.get('host')}${request.url}`);
  }
  next();
};

if (process.env.NODE_ENV === 'production') { app.use(httpsRedirect); }


app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';
app.use(express.static(__dirname + '/public'));

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then((projects) => {
      return response.status(200).json(projects);
    })
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params;
  database('projects').where('id', id).select()
    .then((project) => {
      if (project.length) {
        return response.status(200).json(project);
      }
      return response.status(404).json({ error: `Could not locate project with id: ${id}` });
    })
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  const { id } = request.params;

  database('palettes').where('projectId', id).select()
    .then((palettes) => {
      if (palettes.length) {
        return response.status(200).json(palettes);
      }
      return response.status(404).json({
        error: `Could not locate palettes for project with id: ${id}`
      });
    })
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;

  database('palettes').where('id', id).select()
    .then((palette) => {
      if (palette.length) {
        return response.status(200).json(palette);
      }
      return response.status(404).json({
        error: `Could not find palette with id of ${id}`
      });
    })
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['name']) {
    if (!project[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property.`
      });
    }
  }

  database('projects').insert(project, '*')
    .then((insertedProject) => {
      return response.status(201).json(insertedProject);
    })
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

app.post('/api/v1/projects/:id/palettes', (request, response) => {
  let palette = request.body;
  const { id } = request.params;

  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5']) {
    if (!palette[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property.`
      });
    }
  }

  palette = Object.assign({}, palette, { projectId: id });

  database('palettes').insert(palette, '*')
    .then((insertedPalette) => {
      return response.status(201).json(insertedPalette);
    })
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

app.delete('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;

  database('palettes').where('id', id).del()
    .then((confirmation) => {
      if (!confirmation) {
        return response.status(422).json({ error: 'That resource does not appear to exist to be deleted.' });
      }
      return response.sendStatus(204);
    })
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
