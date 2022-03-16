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
      success: function (res) {
        addTodos([res]);
      },
    });
  });
});

const createTodoElement = (data, id) => {
  let info = data;
  let $taskCard = `
<article class="todo-card">
<div>
  <input type="checkbox">
  <h4>${info}</h6>
</div>
<footer>
  <button id="${id}">Delete</button>
  <form>
  <select name="category" id="edit-${id}">
    <option value="Select">Edit -</option>
    <option value="Movies">Movies</option>
    <option value="Restaurants">Restaurants</option>
    <option value="Books">Books</option>
    <option value="Products">Products</option>
  </select>
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
      case "Movies":
        $("#movies").append(createTodoElement(todo.description, todo.id));
        break;
      case "Books":
        $("#books").append(createTodoElement(todo.description, todo.id));
        break;
      case "Products":
        $("#products").append(createTodoElement(todo.description, todo.id));
        break;
      case "Restaurants":
        $("#restaurants").append(createTodoElement(todo.description, todo.id));
        break;
    }
    addEventDelete(todo.id);
    addEventEdit(todo.id);
  }
};

const addEventDelete = (id) => {
  $("#" + id).click(function () {
    $.ajax({
      url: "/todos/delete",
      method: "POST",
      data: { id: id },
      success: function () {
        $("#" + id)
          .parents(".todo-card")
          .remove();
      },
    });
  });
};

const addEventEdit = (id) => {
  $("#edit-" + id).change(function () {
    let category = $(this).val();
    $.ajax({
      url: "todos/edit",
      method: "POST",
      data: { id, category },
      success: function (res) {
        $("#edit-" + id)
          .parents(".todo-card")
          .remove();
        addTodos([res]);
      },
    });
  });
};
