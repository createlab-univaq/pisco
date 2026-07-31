class_name ExperimentManager
extends Node

@export var actionable: Actionable
@export var textbox: TextBox

var experiment_data: Array = []
var experiment_results: Array[int] = []
var current_experiment_step_index: int = 0
var current_experiment_step_current_question_index: int = 0
var current_experiment_step: Dictionary = {}
var current_experiment_question: Dictionary = {}

const QUESTIONS_KEY: String = "questions"
const CHOICE_TYPE_KEY: String = "type"
const NARRATION_KEY: String = "narration"
const QUESTION_KEY: String = "question"
const CORRECT_ANSWERS_KEY: String = "correctAnswers"

const CHOICE_INPUT_TYPE_KEY: String = "choice_input"

func _ready():
	assert(actionable, "No actionable specified")
	assert(textbox, "No TextBox specified")
	
	actionable.actioned.connect(_on_actionable_actioned)
	
	textbox.text_submitted.connect(_on_text_submitted)
	
	_reset()
	
	# TODO: Must be done on room load after inserting the code ID
	setup_experiment()

func _reset():
	current_experiment_step_index = 0
	current_experiment_step_current_question_index = 0
	current_experiment_step = {}
	current_experiment_question = {}

func setup_experiment():
	experiment_data = _load_json_file("res://api/trainer_demo_1.json")
	for step in experiment_data:
		experiment_results.append(0)

func start_current_experiment_step():
	if experiment_data.is_empty():
		return
	
	current_experiment_step = experiment_data[current_experiment_step_index]
	current_experiment_question = current_experiment_step[QUESTIONS_KEY][current_experiment_step_current_question_index]
	
	if current_experiment_step[CHOICE_TYPE_KEY] == CHOICE_INPUT_TYPE_KEY:
		var choice_text: String = "%s %s" % [current_experiment_question[NARRATION_KEY], current_experiment_question[QUESTION_KEY]]
		textbox.queue_dialogue([DialogueData.new(choice_text, DialogueData.DialogueTypes.INPUT)])
		return

func _next_step_question() -> void:
	current_experiment_step_current_question_index += 1
	if current_experiment_step_current_question_index < current_experiment_step[QUESTIONS_KEY].size():
		start_current_experiment_step()
	else:
		current_experiment_step_current_question_index = 0
		
		current_experiment_step_index += 1
		if not current_experiment_step_index < experiment_data.size():
			# TODO experiment completed
			pass

func _load_json_file(file_path: String):
	if not FileAccess.file_exists(file_path):
		return null

	var file = FileAccess.open(file_path, FileAccess.READ)
	var content = file.get_as_text()

	var json = JSON.new()
	var error = json.parse(content)

	if error == OK:
		# Successfully parsed! 
		var data_received = json.data
		return data_received
	else:
		# Print exact error details
		print("JSON Parse Error: ", json.get_error_message(), " at line ", json.get_error_line())
		return null

func is_in_array_nocase(text: String, array: Array) -> bool:
	var text_lower = text.to_lower()

	for item in array:
		# Check if the item is a String to avoid crashes, then compare
		if item is String and item.to_lower() == text_lower:
			return true
	
	return false

func _on_actionable_actioned(_tile: Actionable, _player: Player) -> void:
	start_current_experiment_step()

func _on_text_submitted(submitted_text: String) -> void:
	if is_in_array_nocase(submitted_text, current_experiment_question[CORRECT_ANSWERS_KEY]):
		# correct
		experiment_results[current_experiment_step_index] = experiment_results[current_experiment_step_index] + 1
	
	_next_step_question()
