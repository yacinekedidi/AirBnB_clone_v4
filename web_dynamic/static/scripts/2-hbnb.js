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
        // $('.available').css('background-color', '#ff545f');
      }
    }
  });
});
