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

const createTodoElement = (data, id) => {
  let info = data;
  let $taskCard = `
<article class="todo-card">
<div>
  <input type="checkbox">
</div>
 ${info}
<footer>
  <button id="${id}">Delete</button>

  <form action="/">
  <label for="categories">Choose a category:</label>
  <select name="category" id="category">
    <option value="Movies">Movies</option>
    <option value="Restaurants">Restaurants</option>
    <option value="Books">Books</option>
    <option value="Products">Products</option>
  </select>
  <br><br>
  <input id="edit-${id}type="submit" value="Submit">
</form>

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
        $('#movies').append(createTodoElement(todo.description, todo.id));
        break;
      case 'Books':
        $('#books').append(createTodoElement(todo.description, todo.id));
        break;
      case 'Products':
        $('#products').append(createTodoElement(todo.description, todo.id));
        break;
      case 'Restaurants':
        $('#restaurants').append(createTodoElement(todo.description, todo.id));
        break;
    };

    addEventDelete(todo.id);

  };
};

const addEventDelete = (id) => {
  $('#' + id).click(function () {
    $.ajax({
      url: "/todos/delete",
      method: "POST",
      data: { 'id': id },
      success: function () {
        $('#' + id).parents('.todo-card').empty();
      }
    });
  });
};
