// Initial sample todos
let todos = [
    {
        id: 1,
        text: "Complete portfolio website development",
        category: "work",
        isCompleted: false
    },
    {
        id: 2,
        text: "Study advanced React concepts and hooks",
        category: "study",
        isCompleted: false
    },
    {
        id: 3,
        text: "Prepare for upcoming job interviews",
        category: "work",
        isCompleted: true
    },
    {
        id: 4,
        text: "Buy groceries and meal prep for the week",
        category: "personal",
        isCompleted: false
    }
];

// App state
let searchTerm = "";
let filterCategory = "All";
let sortDirection = "Asc";

// DOM elements
const todoForm = document.getElementById('todoForm');
const todoTitle = document.getElementById('todoTitle');
const todoCategory = document.getElementById('todoCategory');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');
const sortAsc = document.getElementById('sortAsc');
const sortDesc = document.getElementById('sortDesc');
const todoContainer = document.getElementById('todoContainer');
const totalTodos = document.getElementById('totalTodos');
const completedTodos = document.getElementById('completedTodos');
const pendingTodos = document.getElementById('pendingTodos');

// Utility functions
function generateId() {
    return Date.now() + Math.random();
}

function saveTodos() {
    // In a real app, you'd save to a database
    // For now, we'll keep them in memory
}

// Add todo function
function addTodo(title, category) {
    const newTodo = {
        id: generateId(),
        text: title,
        category: category,
        isCompleted: false
    };
    
    todos.unshift(newTodo); // Add to beginning of array
    saveTodos();
    renderTodos();
    updateStats();
}

// Remove todo function
function removeTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
    updateStats();
}

// Toggle complete function
function toggleComplete(id) {
    todos = todos.map(todo => 
        todo.id === id 
            ? { ...todo, isCompleted: !todo.isCompleted } 
            : todo
    );
    saveTodos();
    renderTodos();
    updateStats();
}

// Filter and sort todos
function getFilteredTodos() {
    return todos
        .filter(todo => 
            todo.text.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(todo => 
            filterCategory === "All" || 
            todo.category.toLowerCase() === filterCategory.toLowerCase()
        )
        .sort((a, b) => {
            const comparison = a.text.localeCompare(b.text);
            return sortDirection === "Asc" ? comparison : -comparison;
        });
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.isCompleted).length;
    const pending = total - completed;

    totalTodos.textContent = total;
    completedTodos.textContent = completed;
    pendingTodos.textContent = pending;
}

// Render todos
function renderTodos() {
    const filteredTodos = getFilteredTodos();
    
    if (filteredTodos.length === 0) {
        todoContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <h4>No tasks found</h4>
                <p>${todos.length === 0 
                    ? 'Add your first task to get started!' 
                    : 'Try adjusting your search or filter criteria.'
                }</p>
            </div>
        `;
        return;
    }

    todoContainer.innerHTML = filteredTodos.map(todo => `
        <div class="todo-item ${todo.isCompleted ? 'completed' : ''}">
            <div class="todo-content">
                <div class="todo-text ${todo.isCompleted ? 'completed' : ''}">${todo.text}</div>
                <span class="todo-category ${todo.category}">${getCategoryIcon(todo.category)} ${todo.category}</span>
            </div>
            <div class="todo-actions">
                <button 
                    class="btn-action btn-complete ${todo.isCompleted ? 'completed' : ''}" 
                    onclick="toggleComplete(${todo.id})"
                >
                    ${todo.isCompleted ? '↶ Undo' : '✓ Complete'}
                </button>
                <button 
                    class="btn-action btn-delete" 
                    onclick="removeTodo(${todo.id})"
                >
                    🗑️ Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        work: '💼',
        personal: '🏠',
        study: '📚'
    };
    return icons[category] || '📝';
}

// Event listeners
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = todoTitle.value.trim();
    const category = todoCategory.value;
    
    if (!title || !category) return;
    
    addTodo(title, category);
    
    // Clear form
    todoTitle.value = "";
    todoCategory.value = "";
    todoTitle.focus();
});

searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderTodos();
});

filterSelect.addEventListener('change', (e) => {
    filterCategory = e.target.value;
    renderTodos();
});

sortAsc.addEventListener('click', () => {
    sortDirection = "Asc";
    sortAsc.classList.add('active');
    sortDesc.classList.remove('active');
    renderTodos();
});

sortDesc.addEventListener('click', () => {
    sortDirection = "Desc";
    sortDesc.classList.add('active');
    sortAsc.classList.remove('active');
    renderTodos();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to add todo
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        todoTitle.focus();
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        searchInput.value = '';
        searchTerm = '';
        renderTodos();
    }
});

// Initialize app
function initApp() {
    renderTodos();
    updateStats();
    todoTitle.focus();
}

// Start the app
initApp();

// Auto-save reminder (simulated)
setInterval(() => {
    console.log('Auto-saving todos...', todos.length, 'tasks');
}, 30000); // Every 30 seconds