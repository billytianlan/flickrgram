var app = {};

//init: 
app.init = function() {
  this.username;
  this.photos;
  this.reachedBottom = false;

  app.getPhotos();
};

app.getPhotos = function (lat, lng) {
  app.reachedBottom = false;
  lat = lat || '37.7749'; 
  lng = lng || '122.4194';
  var url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ad60db9ff9ed4710078f903b051b0589&lat=' + lat + '&lon=' + lng + '&format=json&jsoncallback=?';
  $.getJSON(url, function(data) {
    app.lastPhotoIndex = 0;
    app.photos = data.photos.photo;
    app.appendPhotos();
  });
};

app.appendPhotos = function() {
  if (app.lastPhotoIndex < app.photos.length - 1) {
    var numPhotos = Math.min(20, (app.photos.length - app.lastPhotoIndex));
    for (var x = app.lastPhotoIndex; x < (numPhotos + app.lastPhotoIndex); x++) {
      var cur = app.photos[x];
      var photoURL = 'https://farm' + cur.farm + '.staticflickr.com/' + cur.server + '/' + cur.id + '_' + cur.secret + '.jpg';

      $('.flickr-cards').append( '<div class="card hoverable">\
                          <div class="card-image">\
                            <img src="' + photoURL + '">\
                          </div>\
                          <div class="card-content">\
                            <p>' + cur.title + '</p>\
                          </div>\
                        </div>');
    }
    app.lastPhotoIndex += numPhotos;
  } else {
    $('.flickr-cards').append( '<h3>END OF THE PHOTOS</h3>');
    app.reachedBottom = true;
  }
};


app.clearPhotos = function() {
  $('.flickr-cards').empty();
};

$(function() {
  app.init();

  var input = document.getElementById('autocomplete');
  if (input) {
    var options = {
      types: ['(cities)']
    };

    var autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener('place_changed', searchCity);
  }

  function searchCity() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
    var lat = place.geometry.location.lat().toFixed(4).replace('-', '');
    var lng = place.geometry.location.lng().toFixed(4).replace('-', '');
    console.log(lat);
    console.log(lng); 
    $('h5').text(place.name);
    app.clearPhotos();
    app.getPhotos(lat, lng);
  }

  $(window).on('scroll', function() {
    if (!app.reachedBottom) {
      if ( $(window).scrollTop() >= $(document).height() - $(window).height() ) {
        app.appendPhotos();
      }
    }
  });

  $('.brand-logo').on('click', function() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
  });

});