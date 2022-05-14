const addTaskBtn = document.getElementById('add-task-btn');
const descTaskInput = document.getElementById('description-task');
const todosWrapper = document.getElementById('todos-wrapper');


let tasks;

!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'));
// если LS не существует, то tasks - пустой массив, а если сущ. то берем из LS значения tasks

let todoItemElems = [];

function Task(description) {
    this.description = description;
    this.completed = false;
}

const createTemplate = (task, index) => {
    return `
    <div class="todo-item ${task.completed ? 'checked' : ''} ">
        <input class="description" value="${task.description}" disabled>
        <div class="buttons">
            <input type="checkbox" class="btn-complete" id="checkbox-${index}" ${task.completed ? 'checked' : ''} data-id="${index}" />
                <label for="checkbox-${index}"></label>
            <button class="btn-edit" data-id="${index}">Edit</button>
            <button  class="btn-delete" data-id="${index}">Delete</button>
        </div>
    </div>
    `
}

const filterTasks = () => {
    const activeTasks = tasks.length && tasks.filter(item => item.completed == false);
    const completedTasks = tasks.length && tasks.filter(item => item.completed == true);

    tasks = [...activeTasks, ...completedTasks];
}


const fillHtmlList = () => {
    todosWrapper.innerHTML = '';
    if (tasks.length > 0) {
        filterTasks();
        tasks.forEach((item, index) => {
            todosWrapper.innerHTML += createTemplate(item, index);
        });

        todoItemElems = document.querySelectorAll('.todo-item');
        editTasks();
        completeTasks();
        deleteTasks();
    }
}


fillHtmlList();

const updateLocal = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


addTaskBtn.addEventListener('click', (event) => {
    event.preventDefault();
    if (descTaskInput.value) {
        tasks.push(new Task(descTaskInput.value));
        updateLocal();
        fillHtmlList();
        descTaskInput.value = '';
        descTaskInput.classList.remove('error');
    } else {
        descTaskInput.classList.add('error');
        descTaskInput.addEventListener('focus', function () {
            descTaskInput.classList.remove('error');
        })
    }

})


function completeTasks() {
    let btnComplete = document.querySelectorAll('.btn-complete');
    btnComplete.forEach((el) => {
        el.addEventListener('click', function (event) {
            let target = event.target;
            let dataAttr = target.dataset.id;

            tasks[dataAttr].completed = !tasks[dataAttr].completed;

            if (tasks[dataAttr].completed) {
                todoItemElems[dataAttr].classList.add('checked');
            } else {
                todoItemElems[dataAttr].classList.remove('checked');
            }
            updateLocal();
            fillHtmlList();
        })
    })
}


function editTasks() {
    let btnEdits = document.querySelectorAll('.btn-edit');

    btnEdits.forEach((el) => {
        el.addEventListener('click', (event) => {
            let target = event.target;
            let targetClosest = target.closest('.todo-item').querySelector('.description');
            let dataAttr = target.dataset.id;

            if (target.innerHTML.toLowerCase() == 'edit') {
                targetClosest.removeAttribute('disabled');
                targetClosest.focus();
                target.textContent = 'Save';
            } else {
                targetClosest.setAttribute('disabled', 'disabled');
                target.textContent = 'Edit';
            }
            tasks[dataAttr].description = targetClosest.value;
            updateLocal();
        });
    });
}


function deleteTasks() {
    const btnDelete = document.querySelectorAll('.btn-delete');
    btnDelete.forEach((el) => {
        el.addEventListener('click', (event) => {
            let target = event.target;
            let dataAttr = target.dataset.id;

            tasks.splice(dataAttr, 1);
            updateLocal();
            fillHtmlList();
        });
    });
}

