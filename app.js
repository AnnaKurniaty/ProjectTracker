const express = require('express');
const bodyParser = require('body-parser');
const { Project, Task } = require('./models');
const cors = require('cors'); 

const app = express();
app.use(cors()); 
app.use(bodyParser.json());

app.delete('/projects/:id', async (req, res) => {
  const projectId = req.params.id;

  try {
    await Task.destroy({ where: { projectId } });
    await Project.destroy({ where: { id: projectId } });

    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

app.post('/projects', async (req, res) => {
  console.log('Request body:', req.body);
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ message: 'Failed to create project' });
  }
});

app.put('/projects/:id', async (req, res) => {
  const projectId = req.params.id;

  try {
    const [updated] = await Project.update(req.body, { where: { id: projectId } });

    if (updated) {
      res.json({ message: 'Project updated' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Failed to update project' });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(400).json({ message: 'Failed to create task' });
  }
});

app.post('/projects/:projectId/tasks', async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, projectId: req.params.projectId });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const deleted = await Task.destroy({ where: { id: taskId } });

    if (deleted) {
      res.json({ message: 'Task deleted' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const [updated] = await Task.update(req.body, { where: { id: taskId } });

    if (updated) {
      res.json({ message: 'Task updated' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Failed to update task' });
  }
});

app.get('/projects/:id', async (req, res) => {
  const projectId = req.params.id;

  try {
    const project = await Project.findOne({
      where: { id: projectId },
      include: [{ model: Task, as: 'tasks' }]
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Failed to fetch project' });
  }
});

app.get('/projects', async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [{ model: Task, as: 'tasks' }]
    });

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

app.get('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findOne({
      where: { id: taskId },
      include: [{ model: Project, as: 'project' }]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Failed to fetch task' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
