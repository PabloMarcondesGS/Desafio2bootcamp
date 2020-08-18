const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4')


// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// function validateRepositoreItemsToUpdate(request, response, next){
//   const { likes } = request.body;

//   if(likes){
//       return response.status(400).json({ error: 'You can t update like on this method.'})
//   }

//   return next();
// }

function validateRepositoreId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
      return response.status(400).json({ error: 'Invalid repositore ID.'})
  }

  return next();
}

app.use('/repositories/:id', validateRepositoreId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

 app.post("/repositories", (request, response) => {
    const { title, url, techs} =  request.body;
    const repositorie = { id: uuid(), title, url, techs, likes:0 };

    repositories.push(repositorie);

    return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs} = request.body;

  const repositoreIndex = repositories.findIndex(repositore => repositore.id == id)
  
  if(repositoreIndex < 0){
      return response.status(400).json({ error: 'Repositore not found.'})
  }
  // if(like){
  //   return response.status(400).json({ error: 'Repositore not found.'})
  // }
  const like = repositories[repositoreIndex].likes;
  
  const repositore = {
      id,
      title,
      url,
      techs,
      likes: like
  };

  repositories[repositoreIndex] = repositore;

  return response.json(repositore)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoreIndex = repositories.findIndex(repositore => repositore.id == id)

  if(repositoreIndex < 0){
    return response.status(400).json({ error: 'Repositore not found.'})
  }

  repositories.splice(repositoreIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  // const { title, url, techs} = request.body;

  const repositoreIndex = repositories.findIndex(repositore => repositore.id == id)
  
  if(repositoreIndex < 0){
      return response.status(400).json({ error: 'Repositore not found.'})
  }

  const like = repositories[repositoreIndex].likes;
  
  const repositore = {
      id,
      likes: like+1
  };

  repositories[repositoreIndex] = repositore;

  return response.json(repositore)
});

module.exports = app;
