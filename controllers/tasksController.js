let tasks = [];

exports.getTasks = (req, res) => {
  res.json(tasks);
};

exports.createTask = (req, res) => {
  const task = { id: Date.now(), title: req.body.title };
  tasks.push(task);
  res.status(201).json(task);
};

exports.updateTask = (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.title = req.body.title;
    res.json(task);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
};

exports.deleteTask = (req, res) => {
  tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
  res.status(204).end();
};