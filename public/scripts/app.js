// Client facing scripts here
//event listener to post to todo list
$(()=> {

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


