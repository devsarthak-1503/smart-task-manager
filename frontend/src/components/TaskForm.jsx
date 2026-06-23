import { useState } from "react";

function TaskForm({ addTask }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [dueDate, setDueDate] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        
        addTask({
            title: title.trim(),
            description: description.trim(),
            priority,
            dueDate: dueDate || null
        });

        // Reset fields
        setTitle("");
        setDescription("");
        setPriority("medium");
        setDueDate("");
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <div className="form-group">
                <label>Task Title *</label>
                <input
                    type="text"
                    placeholder="What needs to be done?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea
                    placeholder="Add more details about this task..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                />
            </div>

            <div className="form-row">
                <div className="form-group flex-1">
                    <label>Priority</label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div className="form-group flex-1">
                    <label>Due Date</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>
            </div>

            <button type="submit" className="btn btn-primary btn-add-task">
                <span>➕</span> Add Task
            </button>
        </form>
    );
}

export default TaskForm;
