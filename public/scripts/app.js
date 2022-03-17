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
        $('#submit-box').val("").focus();
      },
    });
  });
});

const createTodoElement = (description, id, complete) => {

  let addClass = '';
  if (complete) {
    addClass = 'strike-through';
  } else {
    addClass = '';
  };

  let $taskCard = `
<article class="todo-card pulse">
<div>
  <input type="checkbox" id="checkbox-${id}">
  <h4>${description}</h4>
</div>
<footer>
<button class="button btn" title="Delete ToDo" id="${id}"><i class="fa fa-trash btn-hover"></i></button>
  <form>
  <select title="Edit ToDo" class="btn btn-secondary btn-sm" data-toggle="dropdown" name="category" id="edit-${id}">
    <option value="Select">-</option>
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
      console.log('response', res)
      addTodos(res);
    },
  });
};

const addTodos = (todos) => {
  for (let todo of todos) {
    switch (todo.category) {
      case "Movies":
        $("#movies").append(createTodoElement(todo.description, todo.id, todo.complete));
        break;
      case "Books":
        $("#books").append(createTodoElement(todo.description, todo.id, todo.complete));
        break;
      case "Products":
        $("#products").append(createTodoElement(todo.description, todo.id, todo.complete));
        break;
      case "Restaurants":
        $("#restaurants").append(createTodoElement(todo.description, todo.id, todo.complete));
        break;
    }
    addEventDelete(todo.id);
    addEventEdit(todo.id);
    // checkDone(todo);

    // if (todo.complete) {
    //   $("#checkbox-" + todo.id).siblings('h4').addClass('strike-through');
    // } else {
    //   $("#checkbox-" + todo.id).siblings('h4').removeClass("strike-through");
    // };

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

const checkDone = (todo) => {

  const id = todo.id
  const complete = todo.complete;
  console.log('complete', complete);

//   $("#checkbox-" + id).change(function () {

//     $.ajax({
//       url: '/todos/check',
//       method: 'POST',
//       data: { id, complete },
//       success: function (res) {
//         console.log(res);
//       }
//     });

//   });


};
