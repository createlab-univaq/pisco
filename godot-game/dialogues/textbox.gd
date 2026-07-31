class_name TextBox
extends Control

@export var player: Player
@export var char_read_rate: float = 0.05
@export var end_symbol: String = "v"
@export var start_symbol: String = "*"

@onready var choices_margin_container: MarginContainer = $VBoxContainer/ChoicesMarginContainer
@onready var choices_v_box_container: VBoxContainer = $VBoxContainer/ChoicesMarginContainer/ChoicesVBoxContainer

@onready var text_input_margin_container: MarginContainer = $VBoxContainer/TextInputMarginContainer
@onready var line_edit: LineEdit = $VBoxContainer/TextInputMarginContainer/LineEdit

@onready var text_box_panel_container: PanelContainer = $VBoxContainer/MarginContainer/TextBoxPanelContainer
@onready var start_symbol_label: Label = $VBoxContainer/MarginContainer/TextBoxPanelContainer/MarginContainer/HBoxContainer/StartSymbolLabel
@onready var dialogue_text_label: Label = $VBoxContainer/MarginContainer/TextBoxPanelContainer/MarginContainer/HBoxContainer/DialogueTextLabel
@onready var end_symbol_label: Label = $VBoxContainer/MarginContainer/TextBoxPanelContainer/MarginContainer/HBoxContainer/EndSymbolLabel

signal dialogue_started
signal line_finished
signal dialogue_completed
signal choice_made(outcome: String)
signal text_submitted(submitted_text: String)

var tween: Tween

enum States {
	READY,
	READING,
	FINISHED,
	CHOOSING,
	WAITING_INPUT
}

var current_state: States = States.READY
var text_queue: Array[DialogueData] = []
var current_line: DialogueData = null

var is_player_already_in_cutscene: bool = false

func _ready() -> void:
	assert(player, "No player selected")
	
	line_edit.text_submitted.connect(_on_text_submitted)
	_reset_textbox()
	
	_close_textbox()
	
	# queue_dialogue([
	# 	DialogueData.new("DIALOGUE_1"),
	# 	DialogueData.new("DIALOGUE_2"),
	# 	DialogueData.new("DIALOGUE_3"),
	# 	DialogueData.new("DIALOGUE_4_QUESTION", DialogueData.DialogueTypes.CHOICES, [
	# 		DialogueChoiceData.new("CHOICE_YES", "yes_path", [
	# 			DialogueData.new("DIALOGUE_YES_1"),
	# 			DialogueData.new("DIALOGUE_YES_2"),
	# 		]),
	# 		DialogueChoiceData.new("CHOICE_NO", "no_path", [
	# 			DialogueData.new("DIALOGUE_NO_1")
	# 		])
	# 	]),
	# 	DialogueData.new("DIALOGUE_5_INPUT", DialogueData.DialogueTypes.INPUT)
	# ])

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("ui_accept"):
		
		# CONSUME THE INPUT! 
		# This stops the event here so the player/world doesn't also react to it.
		get_viewport().set_input_as_handled()
		
		match current_state:
			States.READING:
				dialogue_text_label.visible_ratio = 1.0
				if tween and tween.is_valid():
					tween.kill()
				_on_dialogue_line_complete()
				
			States.FINISHED:
				if text_queue.is_empty():
					_change_state(States.READY)
					_on_dialogue_completed()
				else:
					_display_text()

func insert_dialogue_next(dialogue_sequence: Array[DialogueData]) -> void:
	var new_queue: Array[DialogueData] = dialogue_sequence.duplicate()
	new_queue.append_array(text_queue)
	text_queue = new_queue

func queue_dialogue(dialogue_sequence: Array[DialogueData]) -> void:
	text_queue.append_array(dialogue_sequence)
	
	# Automatically start playing if the textbox is idle
	if current_state == States.READY and not text_queue.is_empty():
		_setup_dialogue_state()
		dialogue_started.emit()
		_display_text()

func _on_dialogue_completed() -> void:
	_reset_textbox()
	dialogue_completed.emit()
	_remove_dialogue_state()

func _setup_dialogue_state():
	if player.is_player_in_cutscene:
		is_player_already_in_cutscene = true
	else:
		player.set_player_as_in_dialogue()
	
	self.show()
	
	# Wait until the engine finishes the current frame before enabling inputs.
	# This instantly prevents double-firing!
	call_deferred("set_process_unhandled_input", true)

func _remove_dialogue_state():
	if not is_player_already_in_cutscene:
		player.set_player_as_not_in_dialogue()
	is_player_already_in_cutscene = false
	
	_close_textbox()

func clear_dialogue() -> void:
	text_queue.clear()
	current_line = null

func _close_textbox() -> void:
	self.hide()
	set_process_unhandled_input(false)

func _reset_textbox() -> void:
	start_symbol_label.text = ""
	end_symbol_label.text = ""
	dialogue_text_label.text = ""
	text_box_panel_container.hide()
	text_input_margin_container.hide()
	_clear_line_edit()
	choices_margin_container.hide()
	_clear_choice_buttons()

func _setup_textbox() -> void:
	start_symbol_label.text = start_symbol
	text_box_panel_container.show()

func _display_text() -> void:
	if tween and tween.is_valid():
		tween.kill()
	
	current_line = text_queue.pop_front()
	var text: String = tr(current_line.text)
	
	dialogue_text_label.text = text
	dialogue_text_label.visible_ratio = 0.0
	end_symbol_label.text = ""
	
	_change_state(States.READING)
	_setup_textbox()
	
	tween = create_tween()
	tween.tween_property(dialogue_text_label, "visible_ratio", 1.0, text.length() * char_read_rate).set_trans(Tween.TRANS_LINEAR)
	tween.tween_callback(_on_tween_completed)

func _on_tween_completed() -> void:
	_on_dialogue_line_complete()

func _change_state(next_state: States) -> void:
	current_state = next_state

func _on_textbox_action_performed():
	if not text_queue.is_empty():
		_display_text()
	else:
		_on_dialogue_completed()

func _on_dialogue_line_complete() -> void:
	line_finished.emit()
	
	match current_line.dialogue_type:
		DialogueData.DialogueTypes.TEXT_ONLY:
			end_symbol_label.text = end_symbol
			_change_state(States.FINISHED)
		
		DialogueData.DialogueTypes.CHOICES:
			_display_choices(current_line.choices)
		
		DialogueData.DialogueTypes.INPUT:
			_display_input()

func _display_choices(choices: Array[DialogueChoiceData]) -> void:
	assert(not current_line.choices.is_empty(), "No choices provided")
	
	_change_state(States.CHOOSING)
	_clear_choice_buttons()
	choices_margin_container.show()
	
	for choice: DialogueChoiceData in choices:
		var btn: Button = Button.new()
		btn.text = tr(choice.text)
		
		btn.focus_mode = Control.FOCUS_ALL
		
		btn.pressed.connect(_on_choice_pressed.bind(choice))
		choices_v_box_container.add_child(btn)
	
	if choices_v_box_container.get_child_count() > 0:
		choices_v_box_container.get_child(0).call_deferred("grab_focus")

func _on_choice_pressed(choice: DialogueChoiceData) -> void:
	choices_margin_container.hide()
	_clear_choice_buttons()
	
	choice_made.emit(choice.outcome)
	
	_change_state(States.READY)
	
	if not choice.next_lines.is_empty():
		insert_dialogue_next(choice.next_lines)
		
	_on_textbox_action_performed()

func _clear_choice_buttons() -> void:
	for child in choices_v_box_container.get_children():
		choices_v_box_container.remove_child(child)
		child.queue_free()

func _display_input() -> void:
	_change_state(States.WAITING_INPUT)
	_clear_line_edit()
	text_input_margin_container.show()
	line_edit.call_deferred("grab_focus")

func _on_text_submitted(new_text: String) -> void:
	if current_state != States.WAITING_INPUT:
		return
	
	text_input_margin_container.hide()
	_clear_line_edit()
	
	text_submitted.emit(new_text)
	
	_change_state(States.READY)
	
	_on_textbox_action_performed()

func _clear_line_edit() -> void:
	line_edit.clear()
