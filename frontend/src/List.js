import React, { useState, useEffect } from 'react';

const List = () => {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('https://kunjaano-backend.vercel.app/balance', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const projects = await response.json();
      setProjects(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    const projectName = document.getElementById('projectName').value;

    try {
      const response = await fetch('https://kunjaano-backend.vercel.app/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: projectName })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Project added:', result);
      fetchProjects(); // Refresh the project list
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const editProject = async (id, name) => {
    const newName = prompt("Edit Project Name:", name);
    if (newName) {
      try {
        const response = await fetch(`https://kunjaano-backend.vercel.app/edit/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: newName })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Project edited:', result);
        fetchProjects(); // Refresh the project list
      } catch (error) {
        console.error("Error editing project:", error);
      }
    }
  };

  const deleteProject = async (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await fetch(`https://kunjaano-backend.vercel.app/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Project deleted:', result);
        fetchProjects(); // Refresh the project list
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  return (
    <div>
      <h2>Kunjaano Family To Vaangal List</h2>

      <div id="projectsContainer">
        {projects.map(project => (
          <div key={project._id}>
            <h3>{project.name}</h3>
            <button onClick={() => editProject(project._id, project.name)}>Edit</button>
            <button onClick={() => deleteProject(project._id)}>Delete</button>
          </div>
        ))}
      </div>

      <br /><br /><br />

      <form id="addForm" onSubmit={handleAddFormSubmit}>
        <input type="text" id="projectName" placeholder="Saamanam" required />
        <button type="submit">Add Saamanam</button>
      </form>
    </div>
  );
};

export default List;
