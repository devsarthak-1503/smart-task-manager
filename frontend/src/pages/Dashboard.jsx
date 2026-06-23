import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { toast } from "react-toastify";

function Dashboard() {
    const { token, loading } = useAuth();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [fetching, setFetching] = useState(true);
    
    // Filters & Search
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");

    useEffect(() => {
        if (!loading && !token) {
            navigate("/login");
        }
    }, [token, loading, navigate]);

    const fetchTasks = async () => {
        try {
            setFetching(true);
            const response = await API.get("/tasks");
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast.error("Failed to load tasks");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchTasks();
        }
    }, [token]);

    const handleAddTask = async (taskData) => {
        try {
            const response = await API.post("/tasks", taskData);
            setTasks([response.data.task, ...tasks]);
            toast.success("Task added successfully");
        } catch (error) {
            console.error("Error adding task:", error);
            toast.error(error.response?.data?.message || "Failed to add task");
        }
    };

    const handleToggleComplete = async (id, currentStatus) => {
        try {
            const response = await API.put(`/tasks/${id}`, { completed: !currentStatus });
            setTasks(tasks.map(t => t._id === id ? response.data.task : t));
            toast.success(!currentStatus ? "Task marked complete" : "Task marked incomplete");
        } catch (error) {
            console.error("Error updating task status:", error);
            toast.error("Failed to update task status");
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await API.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t._id !== id));
            toast.success("Task deleted successfully");
        } catch (error) {
            console.error("Error deleting task:", error);
            toast.error("Failed to delete task");
        }
    };

    if (loading || (!token && !loading)) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Verifying authentication...</p>
            </div>
        );
    }

    // Calculations for metrics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const activeTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Filter logic
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesStatus = statusFilter === "all" || 
                              (statusFilter === "completed" && task.completed) || 
                              (statusFilter === "active" && !task.completed);
                              
        const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    return (
        <div className="dashboard-container">
            {/* Header Dashboard Metrics */}
            <div className="dashboard-header">
                <div>
                    <h1>My Task Dashboard</h1>
                    <p className="subtitle">Keep track of your projects and schedules</p>
                </div>
                <div className="progress-card">
                    <div className="progress-info">
                        <span className="progress-label">Task Completion</span>
                        <span className="progress-value">{completionRate}%</span>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${completionRate}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-num">{totalTasks}</span>
                    <span className="stat-label">Total Tasks</span>
                </div>
                <div className="stat-card active">
                    <span className="stat-num">{activeTasks}</span>
                    <span className="stat-label">Active Tasks</span>
                </div>
                <div className="stat-card completed">
                    <span className="stat-num">{completedTasks}</span>
                    <span className="stat-label">Completed Tasks</span>
                </div>
            </div>

            <div className="dashboard-layout">
                {/* Left Form Panel */}
                <div className="form-panel">
                    <h3>⚡ Create New Task</h3>
                    <TaskForm addTask={handleAddTask} />
                </div>

                {/* Right Lists Panel */}
                <div className="list-panel">
                    <div className="controls-row">
                        {/* Search Input */}
                        <div className="search-box">
                            <span className="search-icon">🔍</span>
                            <input 
                                type="text" 
                                placeholder="Search tasks..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Status Filter Tabs */}
                        <div className="filter-group">
                            <span className="filter-label">Status:</span>
                            <div className="filter-tabs">
                                {["all", "active", "completed"].map(status => (
                                    <button 
                                        key={status}
                                        className={`filter-tab ${statusFilter === status ? "active" : ""}`}
                                        onClick={() => setStatusFilter(status)}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Priority Filter */}
                        <div className="priority-select-filter">
                            <span className="filter-label">Priority:</span>
                            <select 
                                value={priorityFilter} 
                                onChange={(e) => setPriorityFilter(e.target.value)}
                            >
                                <option value="all">All Priorities</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>

                    {filteredTasks.length === 0 ? (
                        <div className="no-tasks-state">
                            <span className="no-tasks-icon">📋</span>
                            <p>No tasks found matching criteria.</p>
                            <p className="no-tasks-hint">Try adjusting your filters or create a new task!</p>
                        </div>
                    ) : (
                        <TaskList 
                            tasks={filteredTasks} 
                            toggleComplete={handleToggleComplete} 
                            deleteTask={handleDeleteTask} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
