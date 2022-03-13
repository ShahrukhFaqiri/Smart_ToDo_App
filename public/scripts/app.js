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
console.log($taskCard);
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
//

const addTodos = (todos) => {
  for (let todo of todos) {
    if(todo.category === "Movies"){
     $('#movies').append(createTodoElement(todo.description));
    }
  }
};
