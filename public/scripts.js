const projectList = document.getElementById('projectList');
const projectDetail = document.getElementById('projectDetail');
const taskList = document.getElementById('taskList');

const modalProjectForm = document.getElementById('modalProjectForm');
const modalProjectName = document.getElementById('modalProjectName');

const taskForm = document.getElementById('taskForm');
const taskName = document.getElementById('taskName');
const taskStatus = document.getElementById('taskStatus');
const taskWeight = document.getElementById('taskWeight');

let selectedProjectId = null;
let editingProjectId = null;
let editingTaskId = null;

const projectModal = document.getElementById('projectModal');
const taskModal = document.getElementById('taskModal');
const closeButtons = document.querySelectorAll('.close');

function resetProjectForm() {
  modalProjectName.value = '';
  editingProjectId = null;
}

function resetTaskForm() {
  taskName.value = '';
  taskStatus.value = 'Draft';
  taskWeight.value = 1;
  editingTaskId = null;
}

function toggleModal(modal, show) {
  modal.style.display = show ? 'block' : 'none';
}

document.getElementById('addProjectBtn').addEventListener('click', () => {
  resetProjectForm();
  toggleModal(projectModal, true);
});

document.getElementById('addTaskBtn').addEventListener('click', () => {
  if (selectedProjectId) {
    resetTaskForm();
    toggleModal(taskModal, true);
  } else {
    alert('Pilih proyek terlebih dahulu.');
  }
});

closeButtons.forEach(btn => {
  btn.onclick = () => {
    toggleModal(projectModal, false);
    toggleModal(taskModal, false);
  };
});

window.onload = loadProjects;

async function loadProjects() {
  try {
    const response = await fetch('http://localhost:3000/projects');
    if (!response.ok) throw new Error('Gagal memuat proyek.');

    const projects = await response.json();
    projectList.innerHTML = '';
    projects.forEach(project => {
      const projectTasks = project.tasks || [];
      const progress = calculateProgress(projectTasks);

      const li = document.createElement('li');
      li.innerHTML = `
        ${project.name} (Progress: ${progress.toFixed(2)}%)
        <div class="project-buttons">
          <button class="edit-btn" onclick="editProject(${project.id})">Edit</button>
          <button class="delete-btn" onclick="deleteProject(${project.id})">Delete</button>
        </div>
      `;
      li.addEventListener('click', () => selectProject(project));
      projectList.appendChild(li);
    });
  } catch (error) {
    alert(error.message);
  }
}

function calculateProgress(tasks) {
  if (!tasks || tasks.length === 0) {
    return 0; 
  }

  const totalWeight = tasks.reduce((total, task) => total + task.weight, 0);
  const completedWeight = tasks.reduce((total, task) => {
    if (task.status === 'Done') {
      return total + task.weight;
    }
    return total;
  }, 0);

  return (completedWeight / totalWeight) * 100;
}

function determineProjectStatus(tasks) {
  if (!tasks || tasks.length === 0) {
    return 'Draft'; 
  }

  if (tasks.every(task => task.status === 'Draft')) {
    return 'Draft';
  } else if (tasks.some(task => task.status === 'In Progress')) {
    return 'In Progress';
  } else if (tasks.every(task => task.status === 'Done')) {
    return 'Done';
  }
  return 'Draft';
}

async function selectProject(project) {
  selectedProjectId = project.id;

  try {
    const response = await fetch(`http://localhost:3000/projects/${project.id}`);
    if (!response.ok) throw new Error('Gagal memuat data proyek dari server.');

    const projectData = await response.json();

    const projectTasks = projectData.tasks || [];

    projectDetail.innerHTML = `
      <h3>${projectData.name}</h3>
      <p>Status: ${determineProjectStatus(projectTasks)}</p>
      <p>Progress: ${calculateProgress(projectTasks)}%</p>
    `;

    taskList.innerHTML = '';
    if (projectTasks.length > 0) {
      projectTasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
          ${task.name} (Bobot: ${task.weight}, Status: ${task.status})
          <div class="task-buttons">
            <button class="edit-btn" onclick="editTask(${task.id}, '${task.name}', '${task.status}', ${task.weight})">Edit</button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
          </div>
        `;
        taskList.appendChild(li);
      });
    }

    const newStatus = determineProjectStatus(projectTasks);
    if (newStatus !== projectData.status) {
      await updateProjectStatusInDatabase(projectData.id, newStatus);
    }

  } catch (error) {
    alert(error.message);
  }
}

async function updateProjectStatusInDatabase(projectId, newStatus) {
  try {
    await fetch(`http://localhost:3000/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });
  } catch (error) {
    alert('Gagal memperbarui status proyek.');
  }
}

// Edit project
async function editProject(projectId) {
  try {
    const response = await fetch(`http://localhost:3000/projects/${projectId}`);
    if (!response.ok) throw new Error('Gagal memuat proyek untuk diedit.');

    const project = await response.json();
    modalProjectName.value = project.name;
    editingProjectId = projectId;
    toggleModal(projectModal, true);
  } catch (error) {
    alert(error.message);
  }
}

// Delete project
async function deleteProject(projectId) {
  if (confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
    try {
      await fetch(`http://localhost:3000/projects/${projectId}`, {
        method: 'DELETE',
      });
      loadProjects();
    } catch (error) {
      alert('Gagal menghapus proyek.');
    }
  }
}

// Add Project
modalProjectForm.onsubmit = async (e) => {
  e.preventDefault();
  const projectData = {
    name: modalProjectName.value,
    status: 'Draft'
  };

  try {
    const method = editingProjectId ? 'PUT' : 'POST';
    const url = editingProjectId ? `http://localhost:3000/projects/${editingProjectId}` : 'http://localhost:3000/projects';
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) throw new Error('Gagal menyimpan proyek.');

    toggleModal(projectModal, false);
    loadProjects();
  } catch (error) {
    alert(error.message);
  }
};

// Edit Task
async function editTask(taskId, name, status, weight) {
  editingTaskId = taskId;
  taskName.value = name;
  taskStatus.value = status;
  taskWeight.value = weight;
  loadProjects();
  toggleModal(taskModal, true);
}

// Delete Task
async function deleteTask(taskId) {
  if (confirm('Apakah Anda yakin ingin menghapus task ini?')) {
    try {
      await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'DELETE',
      });
      selectProject({ id: selectedProjectId });
      loadProjects(); 
    } catch (error) {
      alert('Gagal menghapus task.');
    }
  }
}

// Add Task
taskForm.onsubmit = async (e) => {
  e.preventDefault();
  const taskData = {
    name: taskName.value,
    status: taskStatus.value,
    weight: parseInt(taskWeight.value),
    projectId: selectedProjectId,
  };

  try {
    const method = editingTaskId ? 'PUT' : 'POST';
    const url = editingTaskId ? `http://localhost:3000/tasks/${editingTaskId}` : 'http://localhost:3000/tasks';
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) throw new Error('Gagal menyimpan task.');

    toggleModal(taskModal, false);
    selectProject({ id: selectedProjectId });
    loadProjects();
  } catch (error) {
    alert(error.message);
  }
};
