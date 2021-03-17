
	window.addEventListener('beforeunload', function (e) {
      e.preventDefault();
      e.returnValue = '';
    });

    function getName() {
      var index = document.cookie.indexOf(";");
      var array = document.cookie.slice(0, index);
      var getName = array.indexOf("=");
      var element = array.slice(getName + 1, getName.length);
      return element;
    }


    function checkArray(argument) {
      //check for my port
      var ua = arrays[2].toString();
      var get = ua.split("=");
      var a = decodeURIComponent(get[1]);
      var j = a.split(':');
      var arr = JSON.parse(j[1]);
      var is = arr.indexOf(nameA[1]);
      /////my index

      //find my port
      var ua2 = arrays[1].toString();
      var get2 = ua2.split("=");
      var a2 = decodeURIComponent(get2[1]);
      var j2 = a2.split(':');
      var arr2 = JSON.parse(j2[1]);
      var myport = arr2[is];

      var a = argument.split(",");

      //console.log(`This is how a is split ${a}`)

      if (a[0] === '2' && a[a.length - 1] === '2') {

        //console.log(`Chat dividec ${a}`);
        
        //my invite port
        var myInvitePort = a[1];
        var second = a[2];

        for (var i = 0; i < a.length; i++) {
          if (myport === Number(a[i])) {
              //console.log(Number(a[i]));
              //console.log(a[i + 1]);
              //console.log("Added point 1");
              addElement(a[i + 1], 1);
          } 
        }

      } else  if (a[0] === '1' && a[3] === '1') {

        //console.log('notification');

      } else {

        var messages = JSON.stringify(argument);
        var array = messages.split(',');
        var array2 = array.slice(1);
        var arrayToCreate = [];
        arrayToCreate.push(array2[array2.length - 1]);

        addElement(arrayToCreate);

      }

    }

    messagesSent = [];
    messagesReceived = [];

    

    function addElement(argument, point) {
      //console.log(argument);
      if (argument === undefined) {

        //console.log('Message is undefined');

      } else if (point === 1) {

        //console.log('Called to add the box in the chat ************');

            var check = messagesReceived.filter(x => (argument === x)); 
            //console.log(check);

            if (check.length === 0) {
              var listElement = document.getElementById("mine-list");
              var element = document.createElement("li");
              element.innerHTML = argument;
              listElement.appendChild(element);
              messagesReceived.push(argument);
            }

    

      }  else if (point === undefined) {

          var elementList = argument[argument.length - 1].replace(/(["])/g, "");
          elementList.replace(/]/g, "");
       
          var argumentToString = elementList.toString();
  
          var check2 = messagesReceived.filter(x => (argumentToString === x));

          console.log(messagesSent);

          if (check2.length > 0) {

            console.log('Not added');

          } else if (elementList === messagesSent[messagesSent.length - 1]){

            console.log('Not added');

          } else {

            var listElement = document.getElementById("mine-list");
            var element = document.createElement("li");
            element.innerHTML = elementList;
            element.className = "mine";
            listElement.appendChild(element);
            messagesSent.push(elementList);

          }
     


      } 
    }

    function bin2String(array) {
      var result = "";
      for (var i = 0; i < array.length; i++) {
        result += String.fromCharCode(parseInt(array[i], 2));
    
      }
      return result;
    }

    var socket = new WebSocket("ws://localhost:3000/");

      var myself = document.cookie;
      var arrays = myself.split(';');
      var myport;

      //find my name
      var s = arrays[0].toString();
      var name = s.split('=');
      var nameA = name.split(',');
  

      //fidn my name in users;
      var ua = arrays[2].toString();
      var get = ua.split("=");
      var a = decodeURIComponent(get[1]);
      var j = a.split(':');
      var arr = JSON.parse(j[1]);
      var is = arr.indexOf(nameA[1]);
      /////my index
      console.log(is);

      //find my port
      var ua2 = arrays[1].toString();
      var get2 = ua2.split("=");
      var a2 = decodeURIComponent(get2[1]);
      var j2 = a2.split(':');
      var arr2 = JSON.parse(j2[1]);
      //my port
      myport = arr2[is];

    socket.onopen = function (event) {
      var portNumber = Number(document.getElementById("inputs").className);
      //console.log(typeof [portNumber, myport]);
      socket.send([portNumber, myport]);
    }
    
    socket.onmessage = function (event) {
      checkArray(event.data);
      //console.log(event.data);
    }

    function sendMessage(event) {
      var portNumber = Number(document.getElementById("inputs").className);
      var message = document.getElementById("inputs").value;
      //console.log(`This is when we send the message ${message}`);
      socket.send([portNumber,message]);
      event.preventDefault();
    }
