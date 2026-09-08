@tool
class_name TextBox
extends DialogueComponentBaseNode

@onready var panel_container: PanelContainer = $PanelContainer
@onready var margin_container: MarginContainer = $PanelContainer/MarginContainer
@onready var start_symbol_label: Label = $PanelContainer/MarginContainer/HBoxContainer/StartSymbolLabel
@onready var dialogue_text_rich_text_label: RichTextLabel = $PanelContainer/MarginContainer/HBoxContainer/DialogueTextRichTextLabel
@onready var end_symbol_label: Label = $PanelContainer/MarginContainer/HBoxContainer/EndSymbolLabel

@export var char_read_rate: float = 0.05
@export var end_symbol: String = "v"
@export var start_symbol: String = "*"
@export var show_end_symbol: bool = true:
	set(value):
		show_end_symbol = value
		_update_end_symbol_preview()
@export_range(MINIMUM_TOTAL_WIDTH, MAXIMUM_TOTAL_WIDTH, 1.0, "or_greater") var width: float = DEFAULT_TOTAL_WIDTH:
	set(value):
		width = clamp(value, MINIMUM_TOTAL_WIDTH, MAXIMUM_TOTAL_WIDTH)
		_on_set_dimension()
@export_range(MINIMUM_TOTAL_HEIGHT, MAXIMUM_TOTAL_HEIGHT, 1.0, "or_greater") var height: float = DEFAULT_TOTAL_HEIGHT:
	set(value):
		height = clamp(value, MINIMUM_TOTAL_HEIGHT, MAXIMUM_TOTAL_HEIGHT)
		_on_set_dimension()

const STATE_READING: StringName = &"READING"
const STATE_FINISHED: StringName = &"FINISHED"

const MINIMUM_MARGIN: int = 6
const MINIMUM_TOTAL_HEIGHT: float = 45.0
const DEFAULT_MARGIN: int = 5
const DEFAULT_TOTAL_HEIGHT: float = 55.0
const MAXIMUM_TOTAL_HEIGHT: float = 480.0

const START_AND_END_SYMBOL_WIDTH: float = 23.0
const MINIMUM_TOTAL_WIDTH: float = 100.0
const DEFAULT_TOTAL_WIDTH: float = 300.0
const MAXIMUM_TOTAL_WIDTH: float = 640.0

var dialogue_text_queue: Array[String] = []
var current_line: String = ''

func _ready() -> void:
	if Engine.is_editor_hint():
		_on_set_dimension()
		_update_end_symbol_preview()
		start_symbol_label.text = start_symbol # Previews the start symbol in editor!
	else:
		super._ready()

func _unhandled_input(event: InputEvent) -> void:
	print("maggio")
	if Engine.is_editor_hint():
		return
	
	if event.is_action_pressed("ui_accept"):
		get_viewport().set_input_as_handled()
		
		match current_state:
			STATE_READING:
				dialogue_text_rich_text_label.visible_ratio = 1.0
				_kill_tween()
				_on_dialogue_text_shown()
			
			STATE_FINISHED:
				_state_finished()

func _setup_textbox() -> void:
	end_symbol_label.text = ""
	start_symbol_label.text = start_symbol

func _reset() -> void:
	start_symbol_label.text = ""
	dialogue_text_rich_text_label.text = ""
	end_symbol_label.text = ""

func _set_margin_container_margins(left: int, top: int, right: int, bottom: int) -> void:
	margin_container.add_theme_constant_override("margin_left", left)
	margin_container.add_theme_constant_override("margin_top", top)
	margin_container.add_theme_constant_override("margin_right", right)
	margin_container.add_theme_constant_override("margin_bottom", bottom)

func _display_text() -> void:
	_kill_tween()
	current_line = dialogue_text_queue.pop_front()
	
	_setup_textbox()
	dialogue_text_rich_text_label.text = current_line
	dialogue_text_rich_text_label.visible_ratio = 0.0
	_change_state(STATE_READING)
	
	tween = create_tween()
	tween.tween_property(dialogue_text_rich_text_label, "visible_ratio", 1.0, current_line.length() * char_read_rate).set_trans(Tween.TRANS_LINEAR)
	tween.tween_callback(_on_dialogue_text_shown)

func _on_dialogue_text_shown() -> void:
	action_shown.emit()
	
	if show_end_symbol:
		end_symbol_label.text = end_symbol
	_change_state(STATE_FINISHED)

func _on_dialogue_completed() -> void:
	_reset()
	action_stopped.emit()

func _state_finished() -> void:
	action_performed.emit('')
	if dialogue_text_queue.is_empty():
		_change_state(STATE_READY)
		_on_dialogue_completed()
	else:
		_display_text()

func queue_dialogue_text(dialogue_text_sequence: Array[String]) -> void:
	dialogue_text_queue.append_array(dialogue_text_sequence)
	
	if current_state == STATE_READY and not dialogue_text_queue.is_empty():
		action_started.emit()
		_display_text()

func perform_action() -> void:
	_state_finished()

func _on_set_dimension() -> void:
	# EDITOR SAFETY PATTERN:
	# If the nodes aren't in the tree yet, do nothing. 
	# _ready() will catch it and run this again once it is fully loaded!
	if not is_node_ready():
		return
		
	var new_total_size: Vector2 = Vector2(width, height)
	
	self.custom_minimum_size = new_total_size
	self.size = new_total_size
	panel_container.custom_minimum_size = new_total_size
	panel_container.size = new_total_size
	
	# Cast to int because theme overrides require whole numbers
	var new_margin: int = max(int((DEFAULT_MARGIN * height) / DEFAULT_TOTAL_HEIGHT), MINIMUM_MARGIN)
	_set_margin_container_margins(new_margin, new_margin, new_margin, new_margin)
	
	var new_dialogue_text_rich_text_label_width: float = width - (START_AND_END_SYMBOL_WIDTH * 2.0) - (new_margin * 2.0)
	var new_dialogue_text_rich_text_label_height: float = height - (new_margin * 2.0)
	var new_dialogue_text_rich_text_label: Vector2 = Vector2(new_dialogue_text_rich_text_label_width, new_dialogue_text_rich_text_label_height)
	dialogue_text_rich_text_label.custom_minimum_size = new_dialogue_text_rich_text_label
	dialogue_text_rich_text_label.size = new_dialogue_text_rich_text_label

func _update_end_symbol_preview() -> void:
	if not is_node_ready():
		return
		
	end_symbol_label.visible = show_end_symbol
	
	# Actually show the "v" in the editor so you can design your UI!
	if Engine.is_editor_hint():
		if show_end_symbol:
			end_symbol_label.text = end_symbol
		else:
			end_symbol_label.text = ""
