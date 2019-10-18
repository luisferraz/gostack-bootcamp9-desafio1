const express = require('express');

const server = express();

server.use(express.json());

//Projetos
const projects = [];

var requestCount = 0;

//Retorna o projeto a partir do id, caso ele exista
const retornaProjeto = id => projects.find(p => p.id == id);

//Middlewares
//Contador de Requisições
server.use((req, res, next) => {
  requestCount++;
  console.log(`Quantidade de requisições recebidas: ${requestCount}`);
  return next();
});

//Verificar existencia de id e atribui o projeto para uso posterior
function checkProjectExists(req, res, next) {
  const { id } = req.params;

  req.project = retornaProjeto(id);

  if (!req.project) {
    return res.json(`Projeto ${id} não encontrado.`);
  }

  return next();
};

//CRUD
//Cadastrar novo projeto
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  if ((projects) && (retornaProjeto(id))) {
    return res.json(`Já existe um projeto com o ID ${id} cadastrado.`);
  }

  const project = { id, title, tasks: [] };

  projects.push(project);

  return res.json(`Projeto ${title} cadastrado com sucesso!`);
});

//Listar projetos e tarefas
server.get('/projects/', (req, res) => {
  return res.json(projects);
});

//Alterar titulo do projeto
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { title } = req.body;

  req.project.title = title;

  return res.json(req.project);
});

//Remover um projeto
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const idx = projects.indexOf(req.project);

  projects.splice(idx, 1);
  return res.json('Projeto removido com sucesso!');
});

// Cadastrar tarefas de um projeto
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const task = req.body.title;

  req.project.tasks.push(task);

  return res.json(req.project);
});

server.listen(3000);
