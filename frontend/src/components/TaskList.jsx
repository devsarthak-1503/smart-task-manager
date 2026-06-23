function TaskList({ tasks, toggleComplete, deleteTask }) {
    const formatDate = (dateString) => {
        if (!dateString) return null;
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    };

    const isOverdue = (dateString, completed) => {
        if (!dateString || completed) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(dateString) < today;
    };

    return (
        <div className="task-list">
            {tasks.map((task) => {
                const overdue = isOverdue(task.dueDate, task.completed);
                return (
                    <div 
                        key={task._id} 
                        className={`task-card priority-${task.priority} ${task.completed ? 'task-completed' : ''}`}
                    >
                        <div className="task-card-header">
                            <label className="checkbox-container">
                                <input 
                                    type="checkbox" 
                                    checked={task.completed} 
                                    onChange={() => toggleComplete(task._id, task.completed)}
                                />
                                <span className="checkmark"></span>
                            </label>
                            
                            <div className="task-info">
                                <h4 className="task-title">{task.title}</h4>
                                {task.description && <p className="task-desc">{task.description}</p>}
                            </div>
                        </div>

                        <div className="task-card-footer">
                            <div className="task-meta">
                                <span className={`badge badge-priority badge-${task.priority}`}>
                                    {task.priority.toUpperCase()}
                                </span>
                                
                                {task.dueDate && (
                                    <span className={`task-date ${overdue ? 'date-overdue' : ''}`}>
                                        📅 {formatDate(task.dueDate)} {overdue && "(Overdue)"}
                                    </span>
                                )}
                            </div>

                            <button 
                                onClick={() => deleteTask(task._id)} 
                                className="btn-delete-task"
                                title="Delete task"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default TaskList;
