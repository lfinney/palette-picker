const express = require('express');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';
app.use(express.static(__dirname + '/public'));


app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then( projects => {
      return response.status(200).json(projects);
    })
    .catch( error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params

  database('projects').where('id', id).select()
    .then( project => {
      if (project.length) {
        return response.status(200).json(project);
      } else {
        return response.status(404).json({ error: `Could not locate project with id: ${id}` })
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
})

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  const { id } = request.params

  database('palettes').where('projectId', id).select()
    .then( palettes => {
      if (palettes.length) {
        return response.status(200).json(palettes);
      } else {
        return response.status(404).json({
          error: `Could not locate palettes for project with id: ${id}`
        });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;

  database('palettes').where('id', id).select()
    .then(palette => {
      if (palette.length) {
        return response.status(200).json(palette);
      } else {
        return response.status(404).json({
          error: `Could not find palette with id of ${id}`
        });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
})

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['name']) {
    if(!project[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property.`
      });
    }
  };

  database('projects').insert(project, '*')
    .then(project => {
      return response.status(201).json(project)
    })
    .catch(error => {
      return response.status(500).json({ error });
    })
});

app.post('/api/v1/projects/:id/palettes', (request, response) => {
  let palette = request.body;
  const projectId = request.params.id;

  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5', ]) {
    if(!palette[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property.`
      });
    }
  };

  palette = Object.assign({}, palette, { projectId: projectId });

  database('palettes').insert(palette, '*')
    .then(palette => {
      return response.status(201).json(palette);
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.delete('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;

  database('palettes').where('id', id).del()
    .then(confirmation => {
      if (!confirmation) {
        return response.status(422).json({ error: 'That resource does not appear to exist to be deleted.'})
      } else {1
        return response.sendStatus(204).json({ message: 'Palette successfully deleted'});
      }
    })
    .catch( error => {
      return response.status(500).json({ error });
    })
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
});
