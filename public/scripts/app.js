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
  <button class="delete" id="${id}">Delete</button>
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

    $('.delete').click(function () {

      if (Number(this.id) === Number(todo.id)) {

        $.ajax({
          url: "/todos/delete",
          method: "POST",
          data: { 'id': todo.id },
          success: function () {
            console.log($('#' + todo.id).parents('.todo-card').empty());
          }
        });

      };

    });

  };
};
