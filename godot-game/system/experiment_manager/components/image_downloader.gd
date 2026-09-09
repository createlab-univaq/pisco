class_name ImageDownloader
extends Node

@onready var http_request: HTTPRequest = $HTTPRequest

func load_image_from_web(url: String, on_image_downloaded: Callable) -> void:
	http_request.request_completed.connect(_on_image_downloaded.bind(on_image_downloaded), CONNECT_ONE_SHOT)
	var error = http_request.request(url)
	if error != OK:
		push_error("An error occurred while starting the HTTP request.")

func _on_image_downloaded(result: int, response_code: int, _headers: PackedStringArray, body: PackedByteArray, on_image_downloaded: Callable) -> void:
	# Check if the download was successful
	if result != HTTPRequest.RESULT_SUCCESS or response_code != 200:
		push_error("Failed to download image. Response Code: ", response_code)
		on_image_downloaded.call(null)
		return
	
	if body.size() < 4:
		push_error("Downloaded image data is too small or empty.")
		on_image_downloaded.call(null)
		return
	
	var image: Image = Image.new()
	var error: Error = ERR_FILE_UNRECOGNIZED
	
	# Check the "Magic Bytes" at the start of the file buffer
	if body[0] == 137 and body[1] == 80 and body[2] == 78 and body[3] == 71:
		# PNG: Starts with [137, 80, 78, 71]
		error = image.load_png_from_buffer(body)
	elif body[0] == 255 and body[1] == 216 and body[2] == 255:
		# JPG: Starts with [255, 216, 255]
		error = image.load_jpg_from_buffer(body)
	elif body[0] == 82 and body[1] == 73 and body[2] == 70 and body[3] == 70:
		# WEBP (RIFF Header): Starts with 'R', 'I', 'F', 'F' [82, 73, 70, 70]
		error = image.load_webp_from_buffer(body)
	
	if error != OK:
		push_error("Couldn't parse the image buffer. It might be an unsupported format or corrupted.")
		on_image_downloaded.call(null)
		return
		
	# Convert the Image to an ImageTexture
	var downloaded_texture: ImageTexture = ImageTexture.create_from_image(image)
	
	on_image_downloaded.call(downloaded_texture)
