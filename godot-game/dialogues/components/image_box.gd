class_name ImageBox
extends DialogueComponentBaseNode

@onready var texture_rect: TextureRect = $TextureRect
@onready var image_downloader: ImageDownloader = $ImageDownloader

const STATE_DOWNLOADING_IMAGE: StringName = &"DOWNLOADING_IMAGE"
const STATE_WAITING: StringName = &"WAITING"

var dialogue_images_url_queue: Array[String] = []

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("ui_accept"):
		get_viewport().set_input_as_handled()
		
		match current_state:
			STATE_WAITING:
				_state_waiting()

func _reset() -> void:
	texture_rect.texture = null

func _state_waiting() -> void:
	action_performed.emit()
	if dialogue_images_url_queue.is_empty():
		_change_state(STATE_READY)
		_on_dialogue_completed()
	else:
		_display_image()

func _display_image() -> void:
	var current_image_url = dialogue_images_url_queue.pop_front()
	
	_change_state(STATE_DOWNLOADING_IMAGE)
	image_downloader.load_image_from_web(current_image_url, _on_image_downloaded)

func _on_image_downloaded(image_texture: ImageTexture) -> void:
	if image_texture == null:
		push_warning("Skipping image display due to download error.")
		_reset()
	else:
		texture_rect.texture = image_texture
	
	action_shown.emit()
	_change_state(STATE_WAITING)

func _on_dialogue_completed() -> void:
	_reset()
	action_stopped.emit()

func queue_dialogue_images(dialogue_image_url_sequence: Array[String]) -> void:
	dialogue_images_url_queue.append_array(dialogue_image_url_sequence)
	
	if current_state == STATE_READY and not dialogue_images_url_queue.is_empty():
		action_started.emit()
		_display_image()

func perform_action() -> void:
	_state_waiting()
