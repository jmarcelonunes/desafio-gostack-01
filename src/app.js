const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepoId(request, response, next){
  const {id} = request.params;
  if(!isUuid(id)){
      return response.status(400).json({ error: 'Invalid repository Id.'})
  }

  return next();
}

app.use("/repositories/:id", validateRepoId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(repository);
  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
    const {id} = request.params;
    const {title, url, techs} = request.body;
    const repoIndex = repositories.findIndex( repo => repo.id === id);

    if(repoIndex < 0){
        return response.status(400).json({error: "Repository not found"})
    }

    const repository ={
        id,
        title,
        url,
        techs,
        likes: repositories[repoIndex].likes
    }

    repositories[repoIndex] = repository;

    return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
    const repoIndex = repositories.findIndex( repo => repo.id === id);

    if(repoIndex < 0){
        return response.status(400).json({error: "Repository not found"})
    }

    repositories.splice(repoIndex, 1);

    return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
    const {id} = request.params;
    const repoIndex = repositories.findIndex( repo => repo.id === id);

    if(repoIndex < 0){
        return response.status(400).json({error: "Repository not found"})
    }

    repositories[repoIndex].likes++;

    return response.json({
      likes: repositories[repoIndex].likes
    });
});

module.exports = app;
