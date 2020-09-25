$(function() {
	let dict_ids = {};
	
	$('div.amenities input').change(function() {
		if (this.checked)
		{
			dict_ids[$(this).attr('data-id')] = $(this).attr('data-name');
		}
		else { delete dict_ids[$(this).attr('data-id')]; }

		$("DIV.amenities h4").text(Object.values(dict_ids).join(', '));		
	});
	
});