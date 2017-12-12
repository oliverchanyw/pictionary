// The below code creates a simple HTTP server with the NodeJS `http` module,
// and makes it able to handle websockets. However, currently it does not
// actually have any websocket functionality - that part is your job!

var http = require('http');
var io = require('socket.io');

var requestListener = function (request, response) {
  response.writeHead(200);
  response.end('Hello, World!\n');
};

var server = http.createServer(requestListener);

server.listen(8080, function () {
  console.log('Server is running...');
});

var questions = {};
var socketServer = io(server);
var qnCounter = 0;

socketServer.on('connection', function (socket) {
  // upon connection, send them existing questions
  socket.emit('here_are_the_current_questions', questions);

  // If they add a new question, make question and emit to all
  socket.on('add_new_question', function (data) {
    var question = {text: data.text, answer: null,
                    author: socket.id, id: qnCounter};
    questions[qnCounter++] = question;
    socketServer.emit('new_question_added', question);
  });

  // If they request for qn info, give it to them
  socket.on('get_question_info', function (data) {
    if (questions.hasOwnProperty(data)) {
      socket.emit('question_info', questions[data]);
    } else {
      socket.emit('question_info', null);
    }
  });

  // If updates an answer, broadcast to rest
  socket.on('add_answer', function (data) {
    questions[data.id].answer = data.answer;
    socket.broadcast.emit('answer_added', questions[data.id]);
  });
});
