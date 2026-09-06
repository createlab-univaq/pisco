class_name TextBox
extends Control

@export var player: Player
@export var char_read_rate: float = 0.05
@export var end_symbol: String = "v"
@export var start_symbol: String = "*"

@onready var image_margin_container: MarginContainer = $VBoxContainer/ImageMarginContainer
@onready var image_texture_rect: TextureRect = $VBoxContainer/ImageMarginContainer/ImageTextureRect
@onready var image_downloader: ImageDownloader = $VBoxContainer/ImageMarginContainer/ImageDownloader

@onready var choices_margin_container: MarginContainer = $VBoxContainer/ChoicesMarginContainer
@onready var choices_v_box_container: VBoxContainer = $VBoxContainer/ChoicesMarginContainer/ChoicesVBoxContainer

@onready var text_input_margin_container: MarginContainer = $VBoxContainer/TextInputMarginContainer
@onready var line_edit: LineEdit = $VBoxContainer/TextInputMarginContainer/LineEdit

@onready var question_text_box_panel_container: PanelContainer = $VBoxContainer/QuestionMarginContainer/QuestionTextBoxPanelContainer
@onready var question_start_symbol_label: Label = $VBoxContainer/QuestionMarginContainer/TextBoxPanelContainer/MarginContainer/HBoxContainer/QuestionStartSymbolLabel
@onready var question_dialogue_text_rich_text_label: RichTextLabel = $VBoxContainer/QuestionMarginContainer/QuestionTextBoxPanelContainer/MarginContainer/HBoxContainer/QuestionDialogueTextRichTextLabel
@onready var question_end_symbol_label: Label = $VBoxContainer/QuestionMarginContainer/TextBoxPanelContainer/MarginContainer/HBoxContainer/QuestionEndSymbolLabel

@onready var text_box_panel_container: PanelContainer = $VBoxContainer/MarginContainer/TextBoxPanelContainer
@onready var start_symbol_label: Label = $VBoxContainer/MarginContainer/TextBoxPanelContainer/MarginContainer/HBoxContainer/StartSymbolLabel
@onready var dialogue_text_rich_text_label: RichTextLabel = $VBoxContainer/MarginContainer/TextBoxPanelContainer/MarginContainer/HBoxContainer/DialogueTextRichTextLabel
@onready var end_symbol_label: Label = $VBoxContainer/MarginContainer/TextBoxPanelContainer/MarginContainer/HBoxContainer/EndSymbolLabel

signal dialogue_started
signal line_finished
signal dialogue_completed
signal dialogue_text_shown
signal choices_shown
signal choice_made(outcome: String)
signal text_input_shown
signal text_submitted(submitted_text: String)

var tween: Tween

enum States {
	READY,
	READING,
	FINISHED,
	CHOOSING,
	WAITING_INPUT,
	DOWNLOADING_IMAGE,
	READING_QUESTION
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

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("ui_accept"):
		get_viewport().set_input_as_handled()
		
		match current_state:
			States.READING:
				dialogue_text_rich_text_label.visible_ratio = 1.0
				_kill_tween()
				
				if current_line.dialogue_type == DialogueData.DialogueTypes.QUESTION_WITH_TEXT_ONLY:
					_on_dialogue_line_complete()
				else:
					_on_tween_completed()
			
			States.READING_QUESTION:
				question_dialogue_text_rich_text_label.visible_ratio = 1.0
				_kill_tween()
				
				if current_line.dialogue_type == DialogueData.DialogueTypes.QUESTION_WITH_TEXT_ONLY:
					_on_tween_completed()
				else:
					_on_dialogue_line_complete()
			
			States.FINISHED:
				if text_queue.is_empty():
					_change_state(States.READY)
					_on_dialogue_completed()
				else:
					_display_text()

func queue_dialogue(dialogue_sequence: Array[DialogueData]) -> void:
	text_queue.append_array(dialogue_sequence)
	
	if current_state == States.READY and not text_queue.is_empty():
		_setup_dialogue_state()
		dialogue_started.emit()
		_display_text()

func _on_dialogue_completed() -> void:
	_reset_textbox()
	dialogue_completed.emit()
	_remove_dialogue_state()

func _setup_dialogue_state() -> void:
	if player.is_player_in_cutscene:
		is_player_already_in_cutscene = true
	else:
		player.set_player_as_in_dialogue()
	
	self.show()
	call_deferred("set_process_unhandled_input", true)

func _remove_dialogue_state() -> void:
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
	dialogue_text_rich_text_label.text = ""
	text_box_panel_container.hide()
	
	question_start_symbol_label.text = ""
	question_end_symbol_label.text = ""
	question_dialogue_text_rich_text_label.text = ""
	question_text_box_panel_container.hide()
	
	image_margin_container.hide()
	_clear_image_texture()
	choices_margin_container.hide()
	_clear_choice_buttons()
	text_input_margin_container.hide()
	_clear_line_edit()

func _setup_textbox() -> void:
	start_symbol_label.text = start_symbol
	text_box_panel_container.show()

func _setup_question_textbox() -> void:
	question_start_symbol_label.text = start_symbol
	question_text_box_panel_container.show()

func _kill_tween() -> void:
	if tween and tween.is_valid():
		tween.kill()
		tween = null

func _animate_text(label: RichTextLabel, text: String, target_state: States, callback: Callable) -> void:
	_kill_tween()
	label.text = text
	label.visible_ratio = 0.0
	_change_state(target_state)
	
	tween = create_tween()
	tween.tween_property(label, "visible_ratio", 1.0, text.length() * char_read_rate).set_trans(Tween.TRANS_LINEAR)
	tween.tween_callback(callback)

func _display_text() -> void:
	_kill_tween()
	current_line = text_queue.pop_front()
	
	match current_line.dialogue_type:
		DialogueData.DialogueTypes.IMAGES:
			_change_state(States.DOWNLOADING_IMAGE)
			image_downloader.load_image_from_web(current_line.image_url, _on_image_downloaded)
			
		DialogueData.DialogueTypes.FIXED_TEXT_WITH_QUESTION_CHOICE:
			dialogue_text_rich_text_label.text = current_line.text
			dialogue_text_rich_text_label.visible_ratio = 1.0
			end_symbol_label.text = end_symbol
			_setup_textbox()
			_on_tween_completed()
			
		DialogueData.DialogueTypes.QUESTION_WITH_TEXT_ONLY:
			question_end_symbol_label.text = ""
			_setup_question_textbox()
			_animate_text(question_dialogue_text_rich_text_label, current_line.question_text, States.READING_QUESTION, _on_tween_completed)
			
		_: # Any remaining standard text types
			end_symbol_label.text = ""
			_setup_textbox()
			_animate_text(dialogue_text_rich_text_label, current_line.text, States.READING, _on_tween_completed)

func _on_tween_completed() -> void:
	match current_line.dialogue_type:
		DialogueData.DialogueTypes.TEXT_WITH_QUESTION_CHOICE, DialogueData.DialogueTypes.TEXT_WITH_QUESTION_INPUT, DialogueData.DialogueTypes.FIXED_TEXT_WITH_QUESTION_CHOICE:
			question_end_symbol_label.text = ""
			_setup_question_textbox()
			_animate_text(question_dialogue_text_rich_text_label, current_line.question_text, States.READING_QUESTION, _on_dialogue_line_complete)
			
		DialogueData.DialogueTypes.QUESTION_WITH_TEXT_ONLY:
			end_symbol_label.text = ""
			_setup_textbox()
			_animate_text(dialogue_text_rich_text_label, current_line.text, States.READING, _on_dialogue_line_complete)
			
		_: # If no follow-up animation is needed
			_on_dialogue_line_complete()

func _on_dialogue_line_complete() -> void:
	line_finished.emit()
	
	match current_line.dialogue_type:
		DialogueData.DialogueTypes.TEXT_ONLY, DialogueData.DialogueTypes.QUESTION_WITH_TEXT_ONLY:
			end_symbol_label.text = end_symbol
			dialogue_text_shown.emit()
			_change_state(States.FINISHED)
			
		DialogueData.DialogueTypes.CHOICES, DialogueData.DialogueTypes.TEXT_WITH_QUESTION_CHOICE, DialogueData.DialogueTypes.FIXED_TEXT_WITH_QUESTION_CHOICE:
			_display_choices(current_line.choices)
			choices_shown.emit()
			
		DialogueData.DialogueTypes.INPUT, DialogueData.DialogueTypes.TEXT_WITH_QUESTION_INPUT:
			_display_input()
			text_input_shown.emit()
			
		DialogueData.DialogueTypes.IMAGES:
			image_margin_container.show() # Condensed from _display_image_choices
			_display_choices(current_line.choices)
			choices_shown.emit()

func _on_image_downloaded(image_texture: ImageTexture) -> void:
	if image_texture == null:
		push_warning("Skipping image display due to download error.")
		_clear_image_texture()
	else:
		image_texture_rect.texture = image_texture
		
	_on_dialogue_line_complete()

func _change_state(next_state: States) -> void:
	current_state = next_state

func _on_textbox_action_performed() -> void:
	_change_state(States.READY)
	if not text_queue.is_empty():
		_display_text()
	else:
		_on_dialogue_completed()

func _display_choices(choices: Array[String]) -> void:
	assert(not current_line.choices.is_empty(), "No choices provided")
	
	_change_state(States.CHOOSING)
	_clear_choice_buttons()
	choices_margin_container.show()
	
	for choice: String in choices:
		var btn: Button = Button.new()
		btn.text = choice
		btn.focus_mode = Control.FOCUS_ALL
		btn.pressed.connect(_on_choice_pressed.bind(choice))
		choices_v_box_container.add_child(btn)
	
	if choices_v_box_container.get_child_count() > 0:
		choices_v_box_container.get_child(0).call_deferred("grab_focus")

func _on_choice_pressed(choice: String) -> void:
	choices_margin_container.hide()
	_clear_choice_buttons()
	
	choice_made.emit(choice)
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
	_on_textbox_action_performed()

func _clear_line_edit() -> void:
	line_edit.clear()

func _clear_image_texture() -> void:
	image_texture_rect.texture = null
