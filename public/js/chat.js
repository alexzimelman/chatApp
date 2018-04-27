var socket = io();

function scrollToBottom(){
  //selectors
  var messages = jQuery('#messages');
  var newMSG = messages.children('li:last-child');
  //heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMSGHeight = newMSG.innerHeight();
  var lastMSGHeight = newMSG.prev().innerHeight();

  if( (clientHeight + scrollTop + newMSGHeight + lastMSGHeight) >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
};

socket.on('connect', function()  {
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function(err){
    if(err){
        alert(err);
        window.location.href = '/';
    } else{
        console.log('No error');
    }
  });
});

socket.on('disconnect', function()  {
  console.log('Disconnected from server');
});

socket.on('newMessage', function(message){
  var formattedTime = moment(message.createdAt).format('DD/MM/YYYY HH:mm')
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function(message){
  var formattedTime = moment(message.createdAt).format('DD/MM/YYYY HH:mm')
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', function(e){
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from:'User',
    text: messageTextbox.val()
  }, function(){
      messageTextbox.val('');
  });
});

var locationBTN = jQuery('#send-location');
locationBTN.on('click', function(){
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser.')
  }

  locationBTN.attr('disabled', 'disabled').text('Sending Location...');

  navigator.geolocation.getCurrentPosition(function(position){
      locationBTN.removeAttr('disabled').text('Send Location')
      socket.emit('createLocationMSG', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
  }, function (){
      locationBTN.removeAttr('disabled').text('Send Location')
      alert('Unable to fetch location.');
  });
});
