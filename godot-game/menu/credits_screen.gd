class_name CreditsScreen
extends Control

@export var scroll_speed: float = 60.0 # Adjust this to make it faster/slower
@onready var credits_rich_text_label: RichTextLabel = $CreditsRichTextLabel

func _ready() -> void:
	hide()
	reset() 

func _process(delta: float) -> void:
	credits_rich_text_label.position.y -= scroll_speed * delta
	
	if credits_rich_text_label.position.y < -credits_rich_text_label.size.y:
		finish_credits()

func _input(event: InputEvent) -> void:
	if event.is_action_pressed("ui_cancel") or event.is_action_pressed("ui_accept"):
		finish_credits()

func start_credits() -> void:
	reset() # Get the fresh screen size just in case the window was resized
	show()
	set_process(true)
	set_process_input(true)
	get_tree().paused = true

func finish_credits() -> void:
	reset()
	hide()
	get_tree().paused = false

func reset() -> void:
	credits_rich_text_label.position.y = get_viewport_rect().size.y
	set_process(false)
	set_process_input(false)
