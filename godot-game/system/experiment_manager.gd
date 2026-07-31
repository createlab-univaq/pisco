class_name ExperimentManager
extends Node

@export var actionable: Actionable
@export var textbox: TextBox

var experiment_data: Array = []
var current_experiment_step_index: int = 0
var current_experiment_step_current_question_index: int = 0

const QUESTIONS_KEY: String = "questions"
const CHOICE_TYPE_KEY: String = "type"
const NARRATION_KEY: String = "narration"
const QUESTION_KEY: String = "question"

const CHOICE_INPUT_TYPE_KEY: String = "choice_input"

func _ready():
	assert(actionable, "No actionable specified")
	assert(textbox, "No TextBox specified")
	
	actionable.actioned.connect(_on_actionable_actioned)
	
	_reset()
	
	# TODO: Must be done on room load after inserting the code ID
	setup_experiment()

func _reset():
	current_experiment_step_index = 0
	current_experiment_step_current_question_index = 0

func setup_experiment():
	experiment_data = _load_json_file("res://api/trainer_demo_1.json")

func start_current_experiment_step():
	if experiment_data.is_empty():
		return
	
	var current_experiment_step: Dictionary = experiment_data[current_experiment_step_index]
	var current_experiment_question: Dictionary = current_experiment_step[QUESTIONS_KEY][current_experiment_step_current_question_index]
	
	if current_experiment_step[CHOICE_TYPE_KEY] == CHOICE_INPUT_TYPE_KEY:
		var choice_text: String = "%s %s" % [current_experiment_question[NARRATION_KEY], current_experiment_question[QUESTION_KEY]]
		textbox.queue_dialogue([DialogueData.new(choice_text, DialogueData.DialogueTypes.INPUT)])

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

func _on_actionable_actioned(_tile: Actionable, _player: Player) -> void:
	start_current_experiment_step()
