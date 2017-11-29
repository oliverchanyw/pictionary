// This file contains client (aka browser) side code. Please don't modify the below line;
// it is a flag for our linter.
/* global $, io */

$(document).ready(function () {
  // This code connects to your server via websocket;
  // please don't modify it.
  window.socketURL = 'http://localhost:8080';

  // -------------------- HELPERS -------------------- //
  window.makeQuestion = function (question) {
    var html = '<div data-question-id="' + question.id + '" class="question"><h1>Question ' + '<span class="qid">' + question.id + '</span>' + '</h1><p class="the-question">' +
      question.text + '</p><br><p>Asked by Socket user ID: <span class="socket-user">' +
      question.author + '</p></div><div class="answer"><h1>Answer</h1><p>' +
      '<div class="form-group"><textarea class="form-control" rows="5" id="answer">' +
      question.answer + '</textarea></div></p><button class="btn btn-default" id="update-answer">Add Answer</button></div>';
    return html;
  };

  window.makeQuestionPreview = function (question) {
    var html = [
      '<li data-question-id="' + question.id + '" class="question-preview"><h1><span class="preview-content">' +
      question.text + '</span></h1><p><em>Author: ' + question.author + '</em></p>'
    ];
    html.join('');
    return html;
  };

  // -------------- DOCUMENT LISTENERS -------------- //

  // Question preview listener
  $(document).on('click', '.question-preview', function () {
    var id = Number($(this).attr('data-question-id'));
    window.socket.emit('get_question_info', id);
  });

  // Answer button - Ping the socket when clicked
  $(document).on('click', '#update-answer', function () {
    var id = Number($('.question').attr('data-question-id'));
    var answer = $('#answer').val();
    window.socket.emit('add_answer', {id: id, answer: answer});
  });

  // Close button - hide the add question modal when clicked
  $('#closeModal').on('click', function () {
    $('#questionModal').modal('hide');
  });

  // Submit button - Ping the socket when clicked
  $('#submitQuestion').on('click', function () {
    var newQnText = $('#question-text').val();
    if (newQnText == '') {
      return;
    }
    window.socket.emit('add_new_question', {text: newQnText});
  });

  // ----------------- SOCKET EVENTS ----------------- //

  window.socket = io(window.socketURL);

  window.socket.on('connect', function () {
    // console.log('Connected to server!');
  });

  window.socket.on('here_are_the_current_questions', function (data) {
    for (var qn in data) {
      var htmlNew = window.makeQuestionPreview(data[qn]);
      var $elem = $('<div></div>').html(htmlNew);
      $('.question-list').append($elem);
    }
  });

  window.socket.on('new_question_added', function (data) {
    var htmlNew = window.makeQuestionPreview(data);
    var $elem = $('<div></div>').html(htmlNew);
    $('.question-list').append($elem);
  });

  window.socket.on('question_info', function (data) {
    if (data === null) {
      return;
    }
    var htmlNew = window.makeQuestion(data);
    $('.question-view').html(htmlNew);
  });

  window.socket.on('answer_added', function (data) {
    if ($('.question').attr('data-question-id') == data.id) {
      var htmlNew = makeQuestion(data);
      $('.question-view').html(htmlNew);
    }
  });

});
