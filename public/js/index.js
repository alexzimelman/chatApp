var socket = io();

socket.on('connect', function()  {
  console.log('connected to server');
});

socket.on('disconnect', function()  {
  console.log('Disconnected from server');
});

socket.on('newMessage', function(message){
  var formattedTime = moment(message.createdAt).format('DD/MM/YYYY HH:mm')
  //console.log('newMessage',message);
  var li = jQuery('<li></li>');
  li.text(`(${formattedTime}) ${message.from}:  ${message.text}`);

  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
  var formattedTime = moment(message.createdAt).format('DD/MM/YYYY HH:mm')
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');

  li.text(`(${formattedTime}) ${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
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
