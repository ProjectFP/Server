(function($, Caman){

'use strict';

	var originalId,
		filteredId,
		imagePath;

	imagePath = '/img/test1.jpg';

	originalId = '#original-image';
	filteredId = '#filtered-image';

	$(document).ready(function bindEventHandlers(){

		loadImages(undefined, imagePath);

		$('#file-input').change(readFiles);

		//Helper Functions

		function readFiles () {
			var reader;

		    if (this.files && this.files[0]) {
		        
		        reader = new FileReader();
		        reader.onload = loadImages;
		        reader.readAsDataURL(this.files[0]);
		    }
		}

		function loadImages(e, url) {

			loadImage(e, originalId, url);

			loadImage(e, filteredId, url)

			.then(function(){
				Caman(filteredId, function applyFilters(){
					this.reloadCanvasData();
					this.brightness(0);

					// Add your custom filter here
					this.custom();
					this.render(sendFilteredCanvas);
				});
			});
		}

		function loadImage(e, id, url){
			var canvas,
				context,
				imageObj,
				source,
				deferred;

			deferred = $.Deferred();

			source = url || e.target.result;
			canvas = $(id)[0];
			context = canvas.getContext('2d');
		    
		    imageObj = new Image();

		    imageObj.onload = function() {
				context.clearRect ( 0 , 0 , canvas.width, canvas.height);
				canvas.width = imageObj.width;
				canvas.height = imageObj.height;
				context.drawImage(this, 0, 0);
				deferred.resolve();
		    };

		    imageObj.src = source;

		    return deferred.promise();
		}

		function sendFilteredCanvas(){
			var dataUrl,
				dataObj;

			dataUrl = $(filteredId)[0].toDataURL();
			dataObj = {image: dataUrl};

			$.ajax({
				type: 'POST',
				data: JSON.stringify(dataObj),
		        contentType: 'application/json',
                url: '/upload2',						
                success: callback
            });

			function callback(data){
				var result,
					nonNumberRegex,
					$body;

				$body = $('body');
				nonNumberRegex = /[^0-9]/g;

				removeAllClasses();

				result = data.text.trim();
				$('.result').text(result);

				if (result.length === 0){
					$body.addClass('fail');

				} else if (result.match(nonNumberRegex)){
					$body.addClass('semi-success');

				} else {
					$body.addClass('success');
				}

				function removeAllClasses() {
					$body.removeClass('fail');
					$body.removeClass('semi-success');
					$body.removeClass('success');
				}
			}
		}
	});
})($, Caman);