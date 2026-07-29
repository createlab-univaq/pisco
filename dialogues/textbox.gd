class_name TextBox
extends Control

@export var char_read_rate: float = 0.05
@export var end_symbol: String = "v"
@export var start_symbol: String = "*"

@onready var choices_margin_container: MarginContainer = $VBoxContainer/ChoicesMarginContainer
@onready var choices_v_box_container: VBoxContainer = $VBoxContainer/ChoicesMarginContainer/ChoicesVBoxContainer

@onready var text_box_panel_container: PanelContainer = $VBoxContainer/MarginContainer/TextBoxPanelContainer
@onready var start_symbol_label: Label = $VBoxContainer/MarginContainer/TextBoxPanelContainer/MarginContainer/HBoxContainer/StartSymbolLabel
@onready var dialogue_text_label: Label = $VBoxContainer/MarginContainer/TextBoxPanelContainer/MarginContainer/HBoxContainer/DialogueTextLabel
@onready var end_symbol_label: Label = $VBoxContainer/MarginContainer/TextBoxPanelContainer/MarginContainer/HBoxContainer/EndSymbolLabel

signal dialogue_started
signal line_finished
signal dialogue_completed
signal choice_made(choice_id: String)

var tween: Tween

enum States {
	READY,
	READING,
	FINISHED,
	CHOOSING
}

var current_state: States = States.READY
var text_queue: Array[Dictionary] = []
var current_line: Dictionary = {}

func _ready() -> void:
	TranslationServer.set_locale("it") 
	_reset_textbox()
	
	queue_dialogue([
		"DIALOGUE_1", 
		"DIALOGUE_2",
		"DIALOGUE_3",
		{
			"text": "DIALOGUE_4_QUESTION",
			"choices": [
				{"label": "CHOICE_YES", "id": "yes_path", "next_lines": ["DIALOGUE_YES_1", "DIALOGUE_YES_2"]},
				{"label": "CHOICE_NO", "id": "no_path", "next_lines": ["DIALOGUE_NO_1"]}
			]
		}
	])

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("ui_accept"):
		match current_state:
			States.READING:
				dialogue_text_label.visible_ratio = 1.0
				if tween and tween.is_valid():
					tween.kill()
				_on_dialogue_complete()
				
			States.FINISHED:
				if text_queue.is_empty():
					_change_state(States.READY)
					_reset_textbox()
					dialogue_completed.emit() 
				else:
					_display_text()

func queue_dialogue(dialogue_sequence: Array[Variant]) -> void:
	for item in dialogue_sequence:
		if typeof(item) == TYPE_STRING:
			text_queue.push_back({"text": item})
		elif typeof(item) == TYPE_DICTIONARY:
			text_queue.push_back(item)
		
	# Automatically start playing if the textbox is idle
	if current_state == States.READY and not text_queue.is_empty():
		dialogue_started.emit()
		_display_text()

func clear_dialogue() -> void:
	text_queue.clear()

func _reset_textbox() -> void:
	start_symbol_label.text = ""
	end_symbol_label.text = ""
	dialogue_text_label.text = ""
	text_box_panel_container.hide()
	choices_margin_container.hide()
	_clear_choice_buttons()

func _setup_textbox() -> void:
	start_symbol_label.text = start_symbol
	text_box_panel_container.show()

func _display_text() -> void:
	current_line = text_queue.pop_front()
	var text: String = tr(current_line["text"])
	
	dialogue_text_label.text = text
	dialogue_text_label.visible_ratio = 0.0
	end_symbol_label.text = ""
	
	_change_state(States.READING)
	_setup_textbox()
	
	tween = create_tween()
	tween.tween_property(dialogue_text_label, "visible_ratio", 1.0, text.length() * char_read_rate).set_trans(Tween.TRANS_LINEAR)
	tween.tween_callback(_on_tween_completed)

func _on_tween_completed() -> void:
	_on_dialogue_complete()

func _change_state(next_state: States) -> void:
	current_state = next_state

func _on_dialogue_complete() -> void:
	line_finished.emit()
	
	if current_line.has("choices") and not current_line["choices"].is_empty():
		_display_choices(current_line["choices"])
	else:
		end_symbol_label.text = end_symbol
		_change_state(States.FINISHED)

func _display_choices(choices: Array) -> void:
	_change_state(States.CHOOSING)
	_clear_choice_buttons()
	choices_margin_container.show()
	
	for choice in choices:
		var btn: Button = Button.new()
		btn.text = tr(choice["label"])
		
		btn.focus_mode = Control.FOCUS_ALL 
		
		btn.pressed.connect(_on_choice_pressed.bind(choice))
		choices_v_box_container.add_child(btn)
	
	if choices_v_box_container.get_child_count() > 0:
		choices_v_box_container.get_child(0).call_deferred("grab_focus")

func _on_choice_pressed(choice: Dictionary) -> void:
	choices_margin_container.hide()
	_clear_choice_buttons()
	
	if choice.has("id"):
		choice_made.emit(choice["id"])
	
	_change_state(States.READY)
	
	if choice.has("next_lines") and not choice["next_lines"].is_empty():
		queue_dialogue(choice["next_lines"])
	else:
		if not text_queue.is_empty():
			_display_text()
		else:
			_reset_textbox()
			dialogue_completed.emit()

func _clear_choice_buttons() -> void:
	for child in choices_v_box_container.get_children():
		child.queue_free()
