class_name TextBox
extends Control

@export var CHAR_READ_RATE: float = 0.05
@export var END_SYMBOL: String = "v"
@export var START_SYMBOL: String = "*"

@onready var text_box_margin_container: MarginContainer = $TextBoxMarginContainer
@onready var start_symbol_label: Label = $TextBoxMarginContainer/MarginContainer/HBoxContainer/StartSymbolLabel
@onready var dialogue_text_label: Label = $TextBoxMarginContainer/MarginContainer/HBoxContainer/DialogueTextLabel
@onready var end_symbol_label: Label = $TextBoxMarginContainer/MarginContainer/HBoxContainer/EndSymbolLabel

signal dialogue_started
signal line_finished
signal dialogue_completed

var tween: Tween

enum States {
	READY,
	READING,
	FINISHED
}

var current_state: States = States.READY
var text_queue: Array[String] = []

func _ready() -> void:
	# Note: In a full game, locale should ideally be set in an Autoload/Settings manager
	TranslationServer.set_locale("it") 
	_reset_textbox()
	
	# Example usage
	_load_dialogue([
		"DIALOGUE_1",
		"DIALOGUE_2",
		"DIALOGUE_3"
	])

# Triggers when input is detected, replacing the need for _process checking every frame
func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("ui_accept"):
		match current_state:
			States.READING:
				# Skip text animation
				dialogue_text_label.visible_ratio = 1.0
				if tween and tween.is_valid():
					tween.kill()
				_on_dialogue_complete()
				
			States.FINISHED:
				# Move to next line or close textbox
				if text_queue.is_empty():
					_change_state(States.READY)
					_reset_textbox()
					dialogue_completed.emit() # Emitted only when ALL text is done
				else:
					_display_text()

func _load_dialogue(keys: Array[String]) -> void:
	text_queue.clear()
	for key in keys:
		queue_text(key)
		
	# Auto-start if we are ready and have text
	if current_state == States.READY and not text_queue.is_empty():
		dialogue_started.emit()
		_display_text()

func queue_text(next_text: String) -> void:
	text_queue.push_back(next_text)

func _reset_textbox() -> void:
	start_symbol_label.text = ""
	end_symbol_label.text = ""
	dialogue_text_label.text = ""
	text_box_margin_container.hide()

func _setup_textbox() -> void:
	start_symbol_label.text = START_SYMBOL
	text_box_margin_container.show()

func _display_text() -> void:
	var key: String = text_queue.pop_front()
	var text: String = tr(key)
	
	dialogue_text_label.text = text
	dialogue_text_label.visible_ratio = 0.0
	
	_change_state(States.READING)
	_setup_textbox()
	
	tween = create_tween()
	# TRANS_LINEAR does not need an ease setting.
	# Using text.length() is the preferred Godot 4 method over len(text).
	tween.tween_property(dialogue_text_label, "visible_ratio", 1.0, text.length() * CHAR_READ_RATE).set_trans(Tween.TRANS_LINEAR)
	tween.tween_callback(_on_tween_completed)

func _on_tween_completed() -> void:
	_on_dialogue_complete()

func _change_state(next_state: States) -> void:
	current_state = next_state

func _on_dialogue_complete() -> void:
	end_symbol_label.text = END_SYMBOL
	_change_state(States.FINISHED)
	line_finished.emit()
