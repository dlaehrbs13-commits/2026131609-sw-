/* ===== TaskFlow 앱 로직 ===== */

class TaskFlow {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // 입력 필드와 추가 버튼
        const taskInput = document.getElementById('taskInput');
        const addBtn = document.getElementById('addBtn');

        addBtn.addEventListener('click', () => this.addTask(taskInput.value));
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask(taskInput.value);
            }
        });

        // 필터 버튼
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });
    }

    addTask(text) {
        const taskInput = document.getElementById('taskInput');
        
        if (!text.trim()) {
            alert('과제를 입력하세요!');
            return;
        }

        const task = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
            date: new Date().toLocaleDateString('ko-KR')
        };

        this.tasks.push(task);
        this.saveTasks();
        this.render();
        taskInput.value = '';
        taskInput.focus();
    }

    deleteTask(id) {
        if (confirm('이 과제를 삭제하시겠습니까?')) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks();
            this.render();
        }
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    }

    getFilteredTasks() {
        if (this.currentFilter === 'all') {
            return this.tasks;
        } else if (this.currentFilter === 'active') {
            return this.tasks.filter(t => !t.completed);
        } else if (this.currentFilter === 'completed') {
            return this.tasks.filter(t => t.completed);
        }
    }

    render() {
        const taskList = document.getElementById('taskList');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<div class="empty-message">과제가 없습니다.</div>';
        } else {
            taskList.innerHTML = filteredTasks.map(task => `
                <div class="task-item ${task.completed ? 'completed' : ''}">
                    <input 
                        type="checkbox" 
                        class="task-checkbox" 
                        ${task.completed ? 'checked' : ''} 
                        onchange="app.toggleTask(${task.id})"
                    >
                    <span class="task-text">${this.escapeHtml(task.text)}</span>
                    <span class="task-date">${task.date}</span>
                    <button class="btn-delete" onclick="app.deleteTask(${task.id})">삭제</button>
                </div>
            `).join('');
        }

        // 통계 업데이트
        const totalCount = this.tasks.length;
        const activeCount = this.tasks.filter(t => !t.completed).length;
        const completedCount = this.tasks.filter(t => t.completed).length;

        document.getElementById('totalCount').textContent = totalCount;
        document.getElementById('activeCount').textContent = activeCount;
        document.getElementById('completedCount').textContent = completedCount;
    }

    saveTasks() {
        localStorage.setItem('taskflow_tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('taskflow_tasks');
        return saved ? JSON.parse(saved) : [];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 앱 초기화
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TaskFlow();
});
