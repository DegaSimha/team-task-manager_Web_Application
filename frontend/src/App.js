import { useCallback, useEffect, useState } from 'react';
import './App.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';
const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'DONE'];
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH'];

function App() {
  const [mode, setMode] = useState('login');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || null));
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [projectForm, setProjectForm] = useState({ name: '', description: '' });
  const [taskForm, setTaskForm] = useState({ title: '', description: '', dueDate: '', priority: 'MEDIUM', status: 'TODO', projectId: '', assignedToId: '' });
  const [memberEmail, setMemberEmail] = useState('');

  const fetchHeaders = useCallback(() => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }), [token]);

  const loadDashboard = useCallback(async () => {
    try {
      const headers = fetchHeaders();
      const [projectsRes, tasksRes, dashboardRes] = await Promise.all([
        fetch(`${API_BASE}/api/projects/me`, { headers }),
        fetch(`${API_BASE}/api/tasks/my-tasks`, { headers }),
        fetch(`${API_BASE}/api/tasks/dashboard`, { headers }),
      ]);

      if (projectsRes.ok) setProjects(await projectsRes.json());
      if (tasksRes.ok) setTasks(await tasksRes.json());
      if (dashboardRes.ok) setDashboard(await dashboardRes.json());
    } catch (error) {
      setMessage('Unable to load dashboard.');
    }
  }, [fetchHeaders]);

  const loadUsers = useCallback(async () => {
    if (user?.role !== 'ADMIN') return;
    try {
      const headers = fetchHeaders();
      const res = await fetch(`${API_BASE}/api/users`, { headers });
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (error) {
      setMessage('Unable to load users.');
    }
  }, [fetchHeaders, user]);

  useEffect(() => {
    if (token) {
      setMode('dashboard');
      loadDashboard();
    }
  }, [token, loadDashboard]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage('');

    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ email: data.email, role: data.role }));
      setToken(data.token);
      setUser({ email: data.email, role: data.role });
      setMode('dashboard');
      setMessage('Login successful.');
      setTimeout(() => loadDashboard(), 0);
    } else {
      setMessage('Login failed. Please check your credentials.');
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setMessage('');

    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupForm),
    });

    if (res.ok) {
      setMode('login');
      setMessage('Signup successful. Please login.');
      setSignupForm({ name: '', email: '', password: '', role: 'MEMBER' });
    } else {
      const error = await res.text();
      setMessage(`Signup failed: ${error}`);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setMode('login');
    setProjects([]);
    setTasks([]);
    setDashboard(null);
    setUsers([]);
    setMessage('Logged out.');
  };

  const refresh = async () => {
    await loadDashboard();
    await loadUsers();
  };

  const handleCreateProject = async (event) => {
    event.preventDefault();
    setMessage('');
    const res = await fetch(`${API_BASE}/api/projects`, {
      method: 'POST',
      headers: fetchHeaders(),
      body: JSON.stringify(projectForm),
    });
    if (res.ok) {
      setProjectForm({ name: '', description: '' });
      setMessage('Project created.');
      refresh();
    } else {
      const error = await res.text();
      setMessage(`Project creation failed: ${error}`);
    }
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    setMessage('');
    const body = {
      ...taskForm,
      projectId: Number(taskForm.projectId),
      assignedToId: Number(taskForm.assignedToId),
    };
    const res = await fetch(`${API_BASE}/api/tasks`, {
      method: 'POST',
      headers: fetchHeaders(),
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setTaskForm({ title: '', description: '', dueDate: '', priority: 'MEDIUM', status: 'TODO', projectId: '', assignedToId: '' });
      setMessage('Task created.');
      refresh();
    } else {
      const error = await res.text();
      setMessage(`Task creation failed: ${error}`);
    }
  };

  const handleAddMember = async (projectId) => {
    if (!memberEmail) return;
    setMessage('');
    const res = await fetch(`${API_BASE}/api/projects/${projectId}/members?email=${encodeURIComponent(memberEmail)}`, {
      method: 'POST',
      headers: fetchHeaders(),
    });
    if (res.ok) {
      setMemberEmail('');
      setMessage('Member added.');
      refresh();
    } else {
      const error = await res.text();
      setMessage(`Add member failed: ${error}`);
    }
  };

  const handleRemoveMember = async (projectId, memberId) => {
    setMessage('');
    const res = await fetch(`${API_BASE}/api/projects/${projectId}/members/${memberId}`, {
      method: 'DELETE',
      headers: fetchHeaders(),
    });
    if (res.ok) {
      setMessage('Member removed.');
      refresh();
    } else {
      const error = await res.text();
      setMessage(`Remove member failed: ${error}`);
    }
  };

  const handleUpdateStatus = async (taskId, status) => {
    setMessage('');
    const res = await fetch(`${API_BASE}/api/tasks/${taskId}/status?status=${status}`, {
      method: 'PUT',
      headers: fetchHeaders(),
    });
    if (res.ok) {
      setMessage('Task status updated.');
      refresh();
    } else {
      const error = await res.text();
      setMessage(`Status update failed: ${error}`);
    }
  };

  if (mode === 'signup') {
    return (
      <div className="app-shell">
        <h1>Team Task Manager</h1>
        <form onSubmit={handleSignup} className="card">
          <h2>Signup</h2>
          <input type="text" placeholder="Name" value={signupForm.name} onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })} required />
          <input type="email" placeholder="Email" value={signupForm.email} onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })} required />
          <input type="password" placeholder="Password" value={signupForm.password} onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })} required />
          <select value={signupForm.role} onChange={(e) => setSignupForm({ ...signupForm, role: e.target.value })}>
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit">Create account</button>
          <p>
            Already have an account? <button type="button" onClick={() => setMode('login')}>Login</button>
          </p>
          {message && <div className="message">{message}</div>}
        </form>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="app-shell">
        <h1>Team Task Manager</h1>
        <form onSubmit={handleLogin} className="card">
          <h2>Login</h2>
          <input type="email" placeholder="Email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required />
          <input type="password" placeholder="Password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required />
          <button type="submit">Login</button>
          <p>
            New user? <button type="button" onClick={() => setMode('signup')}>Signup</button>
          </p>
          {message && <div className="message">{message}</div>}
        </form>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>Dashboard</h1>
        <div>
          <span>{user?.email} ({user?.role})</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>
      <div className="content-grid">
        <section className="card">
          <h2>Stats</h2>
          {dashboard ? (
            <div>
              <p>Total tasks: {dashboard.totalTasks}</p>
              <p>To Do: {dashboard.statusCounts?.TODO ?? 0}</p>
              <p>In Progress: {dashboard.statusCounts?.IN_PROGRESS ?? 0}</p>
              <p>Done: {dashboard.statusCounts?.DONE ?? 0}</p>
              <p>Overdue: {dashboard.overdueTasks}</p>
              <div>
                <h4>Tasks per user</h4>
                <ul>
                  {Object.entries(dashboard.tasksPerUser || {}).map(([username, count]) => (
                    <li key={username}>{username}: {count}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p>Loading metrics…</p>
          )}
        </section>
        <section className="card">
          <h2>Projects</h2>
          {projects.length ? (
            <div>
              <ul>
                {projects.map((project) => (
                  <li key={project.id}>
                    <strong>{project.name}</strong> — {project.description}
                    {project.members?.length > 0 && (
                      <div className="project-members">
                        <strong>Members:</strong>
                        <ul>
                          {project.members.map((member) => (
                            <li key={member.id}>
                              {member.email} {member.role === 'ADMIN' ? '(Admin)' : ''}
                              {user?.role === 'ADMIN' && (
                                <button type="button" onClick={() => handleRemoveMember(project.id, member.id)}>
                                  Remove
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {user?.role === 'ADMIN' && (
                      <div className="project-member-form">
                        <input
                          type="email"
                          placeholder="Add member email"
                          value={memberEmail}
                          onChange={(e) => setMemberEmail(e.target.value)}
                        />
                        <button type="button" onClick={() => handleAddMember(project.id)}>Add member</button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No projects found.</p>
          )}
        </section>
        <section className="card">
          <h2>My Tasks</h2>
          {tasks.length ? (
            <ul>
              {tasks.map((task) => (
                <li key={task.id}>
                  <strong>{task.title}</strong> — {task.status}
                  <div className="task-controls">
                    <select value={task.status} onChange={(e) => handleUpdateStatus(task.id, e.target.value)}>
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks assigned.</p>
          )}
        </section>
      </div>
      <div className="content-grid">
        <section className="card">
          <h2>Create Project</h2>
          <form onSubmit={handleCreateProject}>
            <input type="text" placeholder="Project name" value={projectForm.name} onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} required />
            <textarea placeholder="Description" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} required />
            <button type="submit">Create Project</button>
          </form>
        </section>
        <section className="card">
          <h2>Create Task</h2>
          <form onSubmit={handleCreateTask}>
            <input type="text" placeholder="Title" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required />
            <textarea placeholder="Description" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} required />
            <input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} required />
            <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}>
              {PRIORITY_OPTIONS.map((priority) => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
            <select value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select value={taskForm.projectId} onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })} required>
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
            <select value={taskForm.assignedToId} onChange={(e) => setTaskForm({ ...taskForm, assignedToId: e.target.value })} required>
              <option value="">Assign to user</option>
              {users.map((userItem) => (
                <option key={userItem.id} value={userItem.id}>{userItem.email}</option>
              ))}
            </select>
            <button type="submit">Create Task</button>
          </form>
        </section>
      </div>
      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default App;
