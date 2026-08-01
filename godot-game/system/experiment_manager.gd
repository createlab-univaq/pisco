class_name ExperimentManager
extends Node

@export var actionable: Actionable
@export var textbox: TextBox

var experiment_data: Array = []
var experiment_scores: Array[int] = []
var current_experiment_step_index: int = 0
var current_experiment_step_current_question_index: int = 0

var is_activity: bool = false
var current_experiment_activity_step_index: int = 0
var current_experiment_activity_step_current_question_index: int = 0

const QUESTIONS_KEY: String = "questions"
const CHOICE_TYPE_KEY: String = "type"
const NARRATION_KEY: String = "narration"
const QUESTION_KEY: String = "question"
const CORRECT_ANSWERS_KEY: String = "correctAnswers"
const NEXT_KEY: String = "next"
const OPERATOR_KEY: String = "operator"
const THRESHOLD_KEY: String = "threshold"
const NODE_ON_PASS_KEY: String = "nodeOnPass"
const NODE_ON_FAIL_KEY: String = "nodeOnFail"
const ACTIVITIES_KEY: String = "activities"

const CHOICE_INPUT_TYPE_KEY: String = "choice_input"

const GREATER_EQUAL_OPERATOR_KEY: String = "ge"

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
	is_activity = false
	current_experiment_activity_step_index  = 0
	current_experiment_activity_step_current_question_index = 0

func setup_experiment():
	experiment_data = _load_json_file("res://api/trainer_demo_1.json")
	for step in experiment_data:
		experiment_scores.append(0)

func start_current_experiment_step():
	if experiment_data.is_empty():
		return
	
	var current_experiment_step: Dictionary = experiment_data[current_experiment_step_index]
	
	assert(current_experiment_step.has(QUESTIONS_KEY) or current_experiment_step.has(ACTIVITIES_KEY), "Questions or Activities must be specified")
	if current_experiment_step.has(QUESTIONS_KEY):
		_handle_question(current_experiment_step)
		return
	
	_handle_activities(current_experiment_step)

func _handle_question(step: Dictionary) -> void:
	var question: Dictionary = step[QUESTIONS_KEY][current_experiment_step_current_question_index]
	
	_handle_textbox(step[CHOICE_TYPE_KEY], question, step)

func _handle_activities(step: Dictionary) -> void:
	is_activity = true
	
	var current_activity: Dictionary = step[ACTIVITIES_KEY][current_experiment_activity_step_index]
	var current_activity_question: Dictionary = current_activity[QUESTIONS_KEY][current_experiment_activity_step_current_question_index]
	
	_handle_textbox(current_activity[CHOICE_TYPE_KEY], current_activity_question, current_activity)

func _handle_textbox(choice_type: String, question: Dictionary, step: Dictionary):
	if choice_type == CHOICE_INPUT_TYPE_KEY:
		var choice_text: String = "%s %s" % [question[NARRATION_KEY], question[QUESTION_KEY]]
		textbox.text_submitted.connect(_on_text_submitted.bind(step, question))
		textbox.queue_dialogue([DialogueData.new(choice_text, DialogueData.DialogueTypes.INPUT)])
		return

func _next_step_question(step: Dictionary) -> void:
	if not is_activity:
		current_experiment_step_current_question_index += 1
		if current_experiment_step_current_question_index < step[QUESTIONS_KEY].size():
			start_current_experiment_step()
		else:
			current_experiment_step_current_question_index = 0
			
			_on_experiment_step_completed(step)
	else:
		current_experiment_activity_step_current_question_index += 1
		if current_experiment_activity_step_current_question_index < step[QUESTIONS_KEY].size():
			start_current_experiment_step()
		else:
			current_experiment_activity_step_current_question_index = 0
			
			_on_experiment_activity_completed()

func _on_experiment_completed() -> void:
	actionable.disable_collision_shape()

func _on_experiment_step_completed(step: Dictionary) -> void:
	var nextNode: Dictionary = step[NEXT_KEY]
	
	if nextNode.is_empty():
		print("Experiment Completed")
		_on_experiment_completed()
		return
	
	# Other steps required
	if _check_pass_condition(nextNode[OPERATOR_KEY], nextNode[THRESHOLD_KEY]):
		# passed
		print("passed")
		current_experiment_step_index = nextNode[NODE_ON_PASS_KEY]
	else:
		# failed
		print("failed")
		current_experiment_step_index = nextNode[NODE_ON_FAIL_KEY]
	
	# If the next step must start consequently the previous one
	# start_current_experiment_step()

func _on_experiment_activity_completed() -> void:
	var current_experiment_step: Dictionary = experiment_data[current_experiment_step_index]
	
	current_experiment_activity_step_index += 1
	if current_experiment_activity_step_index < current_experiment_step[ACTIVITIES_KEY].size():
		start_current_experiment_step()
		return
	
	current_experiment_activity_step_index = 0
	is_activity = false
	_on_experiment_step_completed(current_experiment_step)

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

func _check_pass_condition(operator_key: String, threshold: int) -> bool:
	var current_experiment_score: int = experiment_scores[current_experiment_step_index]
	match operator_key:
		GREATER_EQUAL_OPERATOR_KEY:
			return current_experiment_score >= threshold
	
	return false

func _on_actionable_actioned(_tile: Actionable, _player: Player) -> void:
	start_current_experiment_step()

func _on_text_submitted(submitted_text: String, step: Dictionary, question: Dictionary) -> void:
	textbox.text_submitted.disconnect(_on_text_submitted.bind(step, question))
	if is_in_array_nocase(submitted_text, question[CORRECT_ANSWERS_KEY]):
		# correct
		experiment_scores[current_experiment_step_index] = experiment_scores[current_experiment_step_index] + 1
	
	_next_step_question(step)
