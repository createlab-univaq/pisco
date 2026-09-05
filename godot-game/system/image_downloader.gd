class_name ImageDownloader
extends Node

@onready var http_request: HTTPRequest = $HTTPRequest

func load_image_from_web(url: String, on_image_downloaded: Callable) -> void:
	http_request.request_completed.connect(_on_image_downloaded.bind(on_image_downloaded), CONNECT_ONE_SHOT)
	var error = http_request.request(url)
	if error != OK:
		push_error("An error occurred while starting the HTTP request.")

func _on_image_downloaded(result: int, response_code: int, headers: PackedStringArray, body: PackedByteArray, on_image_downloaded: Callable) -> void:
	# Check if the download was successful
	if result != HTTPRequest.RESULT_SUCCESS or response_code != 200:
		push_error("Failed to download image. Response Code: ", response_code)
		return
		
	var image: Image = Image.new()
	var error: Error
	
	# We try loading it as a PNG first. 
	# If that fails, we try JPG, then WebP. 
	# This avoids having to manually parse the HTTP Content-Type headers!
	error = image.load_png_from_buffer(body)
	
	if error != OK:
		error = image.load_jpg_from_buffer(body)
		
	if error != OK:
		error = image.load_webp_from_buffer(body)
		
	if error != OK:
		push_error("Couldn't parse the image buffer. It might be an unsupported format.")
		return
		
	# Convert the Image to an ImageTexture
	var downloaded_texture: ImageTexture = ImageTexture.create_from_image(image)
	
	on_image_downloaded.call(downloaded_texture)
