// Client facing scripts here

//event listener to post to todo list
$(() => {
  loadTodos();
  $("#todo-form").on("submit", function (event) {
    event.preventDefault();
    let serializedData = $(this).serialize();
    $.ajax({
      url: "/searches",
      method: "POST",
      data: serializedData,
    });
  });
});

const createTodoElement = (data) => {
  let info = data;
  let $taskCard = `
<article class="todo-card">
<div>
  <input type="checkbox">
</div>
 ${info}
<footer>
  <i>Delete</i>
  <i>Edit</i>
</footer>
</article>
`;
  return $taskCard;
};

const loadTodos = function () {
  $.ajax({
    url: "/todos/display",
    method: "GET",
    success: function (res) {
      addTodos(res);
    },
  });
};

const addTodos = (todos) => {
  for (let todo of todos) {
    switch (todo.category) {
      case 'Movies':
        $('#movies').append(createTodoElement(todo.description));
        break;
      case 'Books':
        $('#books').append(createTodoElement(todo.description));
        break;
      case 'Products':
        $('#products').append(createTodoElement(todo.description));
        break;
      case 'Restaurants':
        $('#restaurants').append(createTodoElement(todo.description));
        break;
    };
  };
};
