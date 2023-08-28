const todoInputElem = document.querySelector('.todo-input');
const todoListElem = document.querySelector('.todo-list');

let todos = [];
let id = 0;

const setTodos = (newTodos) => {
    todos = newTodos;
    localStorage.setItem('todos', JSON.stringify(newTodos));
}

const getAllTodos = () => {
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : [];
}

const appendTodos = (text) => {
    const newId = id++;
    const newTodos = getAllTodos().concat({id: newId, isCompleted: false, content: text })
    // const newTodos = [...getAllTodos(), {id: newId, isCompleted: false, content: text }]
    setTodos(newTodos)
    paintTodos();
}

const deleteTodo = (todoId) => {
    const newTodos = getAllTodos().filter(todo => todo.id !== todoId );
    setTodos(newTodos);
    paintTodos()
}

const completeTodo = (todoId) => {
    const newTodos = getAllTodos().map(todo => todo.id === todoId ? {...todo,  isCompleted: !todo.isCompleted} : todo )
    setTodos(newTodos);
    paintTodos();
}

const updateTodo = (text, todoId) => {
    const currentTodos = getAllTodos();
    const newTodos = currentTodos.map(todo => todo.id === todoId ? ({...todo, content: text}) : todo);
    setTodos(newTodos);
    paintTodos();
}

const onDbclickTodo = (e, todoId) => {
    const todoElem = e.target;
    const inputText = e.target.innerText;
    const todoItemElem = todoElem.parentNode;
    const inputElem = document.createElement('input');
    inputElem.value = inputText;
    inputElem.classList.add('edit-input');
    inputElem.addEventListener('keypress', (e)=>{
        if(e.key === 'Enter') {
            updateTodo(e.target.value, todoId);
            document.body.removeEventListener('click', onClickBody );
        }
    })

    const onClickBody = (e) => {
        if(e.target !== inputElem)  {
            todoItemElem.removeChild(inputElem);
            document.body.removeEventListener('click', onClickBody );
        }
    }
    
    document.body.addEventListener('click', onClickBody)
    todoItemElem.appendChild(inputElem);
}

const paintTodos = () => {
    todoListElem.innerHTML = '';
    const allTodos = getAllTodos();

    allTodos.forEach(todo => { 
        const todoItemElem = document.createElement('li');
        todoItemElem.classList.add('todo-item');

        todoItemElem.setAttribute('data-id', todo.id );

        const checkboxElem = document.createElement('div');
        checkboxElem.classList.add('checkbox');
        checkboxElem.addEventListener('click', () => completeTodo(todo.id));
        
        if (todo.isCompleted) {
            checkboxElem.innerText = '✔';
            todoItemElem.classList.add('checked');
        }

        const todoElem = document.createElement('div');
        todoElem.classList.add('todo');
        todoElem.addEventListener('dblclick', (event) => onDbclickTodo(event, todo.id));
        todoElem.innerText = todo.content;

        const delBtnElem = document.createElement('button');
        delBtnElem.classList.add('delBtn');
        delBtnElem.addEventListener('click', () => deleteTodo(todo.id));
        delBtnElem.innerHTML = 'X';

        todoItemElem.appendChild(checkboxElem);
        todoItemElem.appendChild(todoElem);
        todoItemElem.appendChild(delBtnElem);

        todoListElem.appendChild(todoItemElem);
    });
}


const init = () => {
    todoInputElem.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            appendTodos(e.target.value);
            todoInputElem.value = '';
        }
    });

    // Load stored todos on initialization
    const storedTodos = getAllTodos();
    if (storedTodos.length > 0) {
        todos = storedTodos;
        paintTodos();
    }
}

init()