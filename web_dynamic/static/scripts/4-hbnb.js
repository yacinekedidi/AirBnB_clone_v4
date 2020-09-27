$(function () {
  const dictIds = {};

  $('div.amenities input').change(function () {
    if (this.checked) {
      dictIds[$(this).attr('data-id')] = $(this).attr('data-name');
    } else { delete dictIds[$(this).attr('data-id')]; }

    $('DIV.amenities h4').text(Object.values(dictIds).join(', '));
  });

  $.ajax({
    type: 'GET',
    url: 'http://0.0.0.0:5001/api/v1/status/',
    complete: function (e, xhr, settings) {
      if (e.status === 200) {
        $('DIV#api_status').addClass('available');
      } else {
        $('DIV#api_status').removeClass('available');
      }
    }
  });

  $.ajax({
    type: 'POST',
    data: '{}',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      let s = '';
      for (const place of data) {
        s += '<article>';
        s += '<div class="title_box">';
        s += '<h2>' + place.name + '</h2>';
        s += '<div class="price_by_night">$' + place.price_by_night + '</div>';
        s += '</div>';
        s += '<div class="information">';
        s += '<div class="max_guest">' + place.max_guest + ' Guest';
        if (place.max_guest !== 1) {
          s += 's';
        }
        s += '</div>';
        s += '<div class="number_rooms">' + place.number_rooms + ' Bedroom';
        if (place.number_rooms !== 1) {
          s += 's';
        }
        s += '</div>';
        s += '<div class="number_bathrooms">' + place.number_bathrooms + ' Bathroom';
        if (place.number_bathrooms !== 1) {
          s += 's';
        }
        s += '</div>';
        s += '</div>';
        s += '<div class="description">';
        s += place.description;
        s += '</div>';
        s += '</article>';
      }
      $('section.places').append(s);
    }
  });

  $('button').click(function () {
    if (Object.keys(dictIds).length === 0) {
      $('.places article').remove();
    } else {
      const data = { amenities: Object.keys(dictIds) };
      $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        url: 'http://0.0.0.0:5001/api/v1/places_search/',
        dataType: 'json',
        contentType: 'application/json',
        success: function (d) {
          if (d.length > 0) {
            let s = '';
            for (const place of d) {
              s += '<article>';
              s += '<div class="title_box">';
              s += '<h2>' + place.name + '</h2>';
              s += '<div class="price_by_night">$' + place.price_by_night + '</div>';
              s += '</div>';
              s += '<div class="information">';
              s += '<div class="max_guest">' + place.max_guest + ' Guest';
              if (place.max_guest !== 1) {
                s += 's';
              }
              s += '</div>';
              s += '<div class="number_rooms">' + place.number_rooms + ' Bedroom';
              if (place.number_rooms !== 1) {
                s += 's';
              }
              s += '</div>';
              s += '<div class="number_bathrooms">' + place.number_bathrooms + ' Bathroom';
              if (place.number_bathrooms !== 1) {
                s += 's';
              }
              s += '</div>';
              s += '</div>';
              s += '<div class="description">';
              s += place.description;
              s += '</div>';
              s += '</article>';
            } // FOR
            $('section.places').append(s);
          } else {
            $('.places article').remove();
          }
        } // SUCCESS
      }); // AJAX
    } // else
  });
});
