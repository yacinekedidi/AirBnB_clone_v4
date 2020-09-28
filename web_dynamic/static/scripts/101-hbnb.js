$(function () {
  const dictIds = {};
  const dictIdCity = {};
  const dictIdState = {};
  const dictAll = {};

  $('div.amenities input').change(function () {
    if (this.checked) {
      dictIds[$(this).attr('data-id')] = $(this).attr('data-name');
    } else { delete dictIds[$(this).attr('data-id')]; }

    $('DIV.amenities h4').text(Object.values(dictIds).join(', '));
  });

  $('.state').change(function () {
    if (this.checked) {
      dictIdState[$(this).attr('data-id')] = $(this).attr('data-name');
      dictAll[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete dictIdState[$(this).attr('data-id')];
      delete dictAll[$(this).attr('data-id')];
    }

    $('#sc').text(Object.values(dictAll).join(', '));
  });

  $('.city').change(function () {
    if (this.checked) {
      dictIdCity[$(this).attr('data-id')] = $(this).attr('data-name');
      dictAll[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete dictIdCity[$(this).attr('data-id')];
      delete dictAll[$(this).attr('data-id')];
    }

    $('#sc').text(Object.values(dictAll).join(', '));
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

        s += '<div class="reviews"><h2></h2><span class="help_target" data-id=' + place.id + '>Show</span><ul></ul></div>';
        s += '</article>';
      }
      $('section.places').append(s);

      $('.reviews ul').hide();

      $('span.help_target').click(function () {
        const ul = $(this).parent('.reviews').children('ul');
        const h2 = $(this).parent('.reviews').children('h2');
        let x;
        $.get('http://0.0.0.0:5001/api/v1/places/' + $(this).attr('data-id') + '/reviews', function (data) {
          for (const review of data) {
            const myDate = new Date(review.created_at);
            const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const ordinals = ['st', 'nd', 'rd'];
            let n = 'th';
            if (myDate.getDate() < 4) { n = ordinals[myDate.getDate() - 1]; }
            const output = myDate.getDate() + n + ' ' + (month[myDate.getMonth()]) + ' ' + myDate.getFullYear();
            const li = '<li><h3>From <span class="owner"></span> the' + output + '</h3><p>' + review.text + '</p></li>';
            ul.append(li);
            if (data.length === 1) { x = 'Review'; } else { x = 'Reviews'; }
            h2.html(data.length + ' ' + x);
          }
          if (data.length > 0) {
            $.get('http://0.0.0.0:5001/api/v1/users/' + data[0].user_id, function (data) {
              $('.reviews .owner').append(data.first_name + ' ' + data.last_name);
            });
          }
        });
        $(this).parent('.reviews').children('ul').toggle();
        $(this).text($(this).text() === 'Hide' ? 'Show' : 'Hide');
        ul.empty();
      });
    }
  });

  $('button').click(function () {
    // if (Object.keys(dictIds).length === 0) {
    $('.places article').remove();
    // } else {
    const data = {
      amenities: Object.keys(dictIds),
      state: Object.keys(dictIdState),
      city: Object.keys(dictIdCity)
    };

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      dataType: 'json',
      contentType: 'application/json',
      success: function (d) {
        $('.places').empty();
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
            s += '<div class="reviews"><h2></h2><span class="help_target" data-id=' + place.id + '>Show</span><ul></ul></div>';
            s += '</article>';
          } // FOR
          $('section.places').append(s);
          $('.reviews ul').hide();
          $('span.help_target').click(function () {
            const ul = $(this).parent('.reviews').children('ul');
            const h2 = $(this).parent('.reviews').children('h2');
            let x;
            $.get('http://0.0.0.0:5001/api/v1/places/' + $(this).attr('data-id') + '/reviews', function (data) {
              for (const review of data) {
                const myDate = new Date(review.created_at);
                const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                const ordinals = ['st', 'nd', 'rd'];
                let n = 'th';
                if (myDate.getDate() < 4) { n = ordinals[myDate.getDate() - 1]; }
                const output = myDate.getDate() + n + ' ' + (month[myDate.getMonth()]) + ' ' + myDate.getFullYear();
                const li = '<li><h3>From <span class="owner"></span> the' + output + '</h3><p>' + review.text + '</p></li>';
                ul.append(li);
                if (data.length === 1) { x = 'Review'; } else { x = 'Reviews'; }
                h2.html(data.length + ' ' + x);
              }
              $.get('http://0.0.0.0:5001/api/v1/users/' + data[0].user_id, function (data) {
                $('.reviews .owner').append(data.first_name + ' ' + data.last_name);
              });
            });
            $(this).parent('.reviews').children('ul').toggle();
            $(this).text($(this).text() === 'Hide' ? 'Show' : 'Hide');
            ul.empty();
          });
        } else {
          $('.places article').remove();
        }
      } // SUCCESS
    }); // AJAX
    // } // else
  });
});
