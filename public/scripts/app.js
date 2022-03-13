// Client facing scripts here



//event listener to post to todo list
$(()=> {
loadTodos();
  $("#todo-form").on('submit',function (event) {
    event.preventDefault();
    let serializedData = $(this).serialize()
    $.ajax({
      url:'/todos/',
      method: 'POST',
      data: serializedData
    })
  });
});


const loadTodos = function(){
  $.ajax({
    url:'/todos/display',
    method: 'GET',
    success: function(res){
      console.log(res);
    }
  })
}
