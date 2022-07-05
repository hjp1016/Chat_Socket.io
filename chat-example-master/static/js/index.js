var socket = io()


/* 접속 되었을 때 실행 */
socket.on('connect', function() {
  function getParameterByName(name) { // 입력받은 이름값 get방식으로 가져오기
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), //주소에서 이름과 한줄소개 빼오기
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
  var name = getParameterByName('user'); // 유저 이름과
  socket.emit('newUser', name)

  /* 서버에 새로운 유저가 왔다고 알림 */

})

 /*서버로부터 데이터 받은 경우 */
socket.on('update', function(data) {
  var chat = document.getElementById('chat')
  chat.scrollTop = chat.scrollHeight;

  var message = document.createElement('div')
  
  var node = document.createTextNode(`${data.name} ${data.message} ${data.time}`)
  var className = ''
  

  // 타입에 따라 적용할 클래스를 다르게 지정
  switch(data.type) {
    case 'message':
      className = 'other'
      const { name, message, time } = data;
      const item = new LiModel(name, message, time);
      item.makeLi();

      break

    case 'connect':
      className = 'connect'
      break

    case 'disconnect':
      className = 'disconnect'
      break
  }
  if(className != 'other'){
    message.classList.add(className)
    message.appendChild(node)
    chat.appendChild(message)
  }
  chat.scrollTop = chat.scrollHeight;

})

function LiModel(name, message, time) {
  this.name = name;
  this.message = message;
  this.time = time;

  this.makeLi = () => {
    const li = document.createElement('div');
    const dom = `<div class="profile"></br>
    <div class="user">${this.name}</div></br>
    <div class="message">${this.message}</div></br>
    <div class="time">${this.time}</div>`;

    li.innerHTML = dom;
    chat.appendChild(li);
  };
}

function entrykey(){
  if(window.event.keyCode==13){
    send();
  }
}
/* 메시지 전송 함수 */
function send() {
  // 입력되어있는 데이터 가져오기
  var message = document.getElementById('test').value
  message = " \u00A0" + message + "\u00A0"
  
   
  // 가져왔으니 데이터 빈칸으로 변경
  document.getElementById('test').value = ''


  var today = new Date(); 
  var hours = ('0' + today.getHours()).slice(-2); 
  var minutes = ('0' + today.getMinutes()).slice(-2);
  var time = hours + ':' + minutes; 
  var chat = document.getElementById('chat')

  // 내가 전송할 메시지 클라이언트에게 표시
  const li = document.createElement('div');
  const dom = `<div class="myprofile"></br>
  <div class="me">${message}</div></br>
  <div class="mytime">${time}</div>`;

  li.innerHTML = dom;
  chat.appendChild(li);

  // 서버로 message 이벤트 전달 + 데이터와 함께
  socket.emit('message', {type: 'message', message: message, time:time })

  chat.scrollTop = chat.scrollHeight;
}


