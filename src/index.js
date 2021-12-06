const express = require('express');

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());

const repositories = [];

function verifyIfRepositoryExists(request, response, next) {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({
      error: 'Repository does not exists',
    });
  }

  return next();
}

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put('/repositories/:id', verifyIfRepositoryExists, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  const newRepository = {
    ...repositories[repositoryIndex],
    title: title ? title : repositories[repositoryIndex].title,
    url: url ? url : repositories[repositoryIndex].url,
    techs: techs ? techs : repositories[repositoryIndex].techs,
  };

  repositories[repositoryIndex] = newRepository;

  return response.json(newRepository);
});

app.delete(
  '/repositories/:id',
  verifyIfRepositoryExists,
  (request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(
      (repository) => repository.id === id
    );

    if (repositoryIndex < 0) {
      return response.status(404).json({ error: 'Repository not found' });
    }

    repositories.splice(repositoryIndex, 1);

    return response.status(204).send();
  }
);

app.post(
  '/repositories/:id/like',
  verifyIfRepositoryExists,
  (request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(
      (repository) => repository.id === id
    );

    if (repositoryIndex < 0) {
      return response.status(404).json({ error: 'Repository not found' });
    }

    const updatedRepository = {
      ...repositories[repositoryIndex],
      likes: repositories[repositoryIndex].likes + 1,
    };

    repositories[repositoryIndex] = updatedRepository;

    return response.json({ likes: updatedRepository.likes });
  }
);

module.exports = app;
