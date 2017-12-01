//Pulls in express library
const express = require('express');
//Pulls in body-parser so that express can receive and parse json objects in body
const bodyParser = require('body-parser');

//creates an instance of express for our application
const app = express();

//connects bodyParser to the application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//variable to use dynamic environments but will default to development
const environment = process.env.NODE_ENV || 'development';
//configures the knex environment
const configuration = require('./knexfile')[environment];
//connects knex with our given environment
const database = require('knex')(configuration);

//declares the port that is based on the environment or default to 3000
app.set('port', process.env.PORT || 3000);
//locally stored title for the project
app.locals.title = 'Palette Picker';
//serves up the static elements of the application: html, css, and js files
app.use(express.static(__dirname + '/public'));

//Retrieves all projects from the database
app.get('/api/v1/projects', (request, response) => {
  //Selects projects table from the application database
  database('projects').select()
    //if there is data there and the server can send it back a 200 response
    //and the data is sent to client
    .then((projects) => {
      return response.status(200).json(projects);
    })
    //if the the request failed for some reason a 500 response
    //is sent to client
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

//Retrieves a specific project from the database based on project id
app.get('/api/v1/projects/:id', (request, response) => {
  //pulls the id from the dynamic route and assigns it to a variable
  const { id } = request.params;
  //Selects the project from the projects table with a matching id to
  //the dynamic route id
  database('projects').where('id', id).select()
    //if there is a project to return a 200 response and the project is sent
    .then((project) => {
      if (project.length) {
        return response.status(200).json(project);
      }
      //if the project doesn't exist a 404 error designating that the project
      //could not be found is sent
      return response.status(404).json({ error: `Could not locate project with id: ${id}` });
    })
    //if the the request failed for some reason a 500 response
    //is sent to client
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

//Retrieves all palettes for a specific project from the database
app.get('/api/v1/projects/:id/palettes', (request, response) => {
  //pulls the id from the dynamic route and assigns it to a variable
  const { id } = request.params;

  //Selects all palettes from the palettes table with a foreign key match to the
  //project id from the dynamic route
  database('palettes').where('projectId', id).select()
    //if there is a palette to return a 200 response and the project is sent
    .then((palettes) => {
      if (palettes.length) {
        return response.status(200).json(palettes);
      }
      //if the palette doesn't exist a 404 error designating that the project
      //could not be found is sent
      return response.status(404).json({
        error: `Could not locate palettes for project with id: ${id}`
      });
    })
    //if the the request failed for some reason a 500 response
    //is sent to client
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

//Retrieves a specific palette the database
app.get('/api/v1/palettes/:id', (request, response) => {
  //pulls the id from the dynamic route and assigns it to a variable
  const { id } = request.params;

  //Selects palettes table from the application database with a matching id to
  //the dynamic route id
  database('palettes').where('id', id).select()
    .then((palette) => {
      //if there is a palette to return a 200 response and the project is sent
      if (palette.length) {
        return response.status(200).json(palette);
      }
      //if the palette doesn't exist a 404 error designating that the project
      //could not be found is sent
      return response.status(404).json({
        error: `Could not find palette with id of ${id}`
      });
    })
    //if the the request failed for some reason a 500 response
    //is sent to client
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

//Sends a new project to the database
app.post('/api/v1/projects', (request, response) => {
  //extracts the data for a new project from the body of a request
  const project = request.body;

  //checks the body data to ensure that all necessary information is present
  for (let requiredParameter of ['name']) {
    //if request is missing information a 422 is sent to user informing them
    //the request cannot be processed
    if (!project[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property.`
      });
    }
  }

  //if all requirements above are met the projects table is selected in the
  //database and the new project is added
  database('projects').insert(project, '*')
    //if insertion of data was successful a 201 is returned to the user
    .then((insertedProject) => {
      return response.status(201).json(insertedProject);
    })
    //if the the request failed for some reason a 500 response
    //is sent to client
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

//Sends a new palette to the database with a project id
app.post('/api/v1/projects/:id/palettes', (request, response) => {
  //extracts the data for a new palette from the body of a request
  let palette = request.body;
  //pulls the id from the dynamic route and assigns it to a variable
  const { id } = request.params;

  //checks the body data to ensure that all necessary information is present
  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5']) {
    //if request is missing information a 422 is sent to user informing them
    //the request cannot be processed
    if (!palette[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property.`
      });
    }
  }


  //if all requirements above all the necessary data is reformed into a new
  //object to be sent to the server
  palette = Object.assign({}, palette, { projectId: id });

  //the palettes table is selected in the database and the new palette
  //object is added
  database('palettes').insert(palette, '*')
    .then((insertedPalette) => {
      return response.status(201).json(insertedPalette);
    })
    //if the the request failed for some reason a 500 response
    //is sent to client
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

//Destroys a palette from the database based on its id
app.delete('/api/v1/palettes/:id', (request, response) => {
  //pulls the id from the dynamic route and assigns it to a variable
  const { id } = request.params;

  //Selects palettes table from the application database with a matching id to
  //the dynamic route id and deletes the palette with a matching id
  database('palettes').where('id', id).del()
    //if there was no resource to delete a 422 is sent to client informing that
    //the resource in question was not there
    .then((confirmation) => {
      if (!confirmation) {
        return response.status(422).json({ error: 'That resource does not appear to exist to be deleted.' });
      }
      //successful destruction results in a 204
      return response.sendStatus(204);
    })
    //if the the request failed for some reason a 500 response
    //is sent to client
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

//Starts the whole process. Sets the server to "listen" to requests from the
//client and informs a developer where the application is running
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
