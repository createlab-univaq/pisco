class_name BaseExperimentTask
extends Node

signal task_completed(answers: Array[AnswerRecord], max_score: int)

var dialogue_controller: DialogueController
var stopwatch: Stopwatch
var mouse_tracker: MouseDistanceTracker
var first_input_interceptor: FirstInputInterceptor

var current_node_definition: Dictionary
var answers_record: Array[AnswerRecord] = []
var max_score: int = 0

# The Manager will call this to inject dependencies
func initialize(p_dialogue_controller: DialogueController, p_stopwatch: Stopwatch, p_mouse: MouseDistanceTracker, p_first_input_interceptor: FirstInputInterceptor) -> void:
	self.dialogue_controller = p_dialogue_controller
	self.stopwatch = p_stopwatch
	self.mouse_tracker = p_mouse
	self.first_input_interceptor = p_first_input_interceptor

# The Manager calls this to begin the specific task
func start_task(node_data: Dictionary) -> void:
	current_node_definition = node_data
	answers_record.clear()
	_execute_task() # Children will override this!

# Children MUST override this with their specific logic
func _execute_task() -> void:
	push_error("BaseExperimentTask._execute_task() must be overridden by child!")

# Shared logic for starting a question (used by all children)
func _start_question_timers() -> void:
	mouse_tracker.start_tracking()
	# Start reaction time stopwatch
	stopwatch.start()
	
	first_input_interceptor.first_input_detected.connect(_on_first_input_detected, CONNECT_ONE_SHOT)
	first_input_interceptor.start_listening()
	
	# Add an empty answer record ready to be filled
	answers_record.append(AnswerRecord.new())

# Shared logic for recording an answer (used by all children)
func _record_answer(user_answer: Variant, is_user_answer_correct: bool) -> void:
	# Stop response time stopwatch
	stopwatch.stop()
	
	var current_answer: AnswerRecord = answers_record.back()
	
	current_answer.user_answer = user_answer
	current_answer.correct = is_user_answer_correct
	
	current_answer.response_time_in_milliseconds = stopwatch.time_elapsed
	
	mouse_tracker.stop_tracking()
	current_answer.mouse_distance_in_centimeters = mouse_tracker.total_distance_cm
	mouse_tracker.reset_tracking()
	
	stopwatch.reset()

# Call this when the child task is totally done
func finish_task() -> void:
	task_completed.emit(answers_record, max_score)

func _on_first_input_detected() -> void:
	# Stop reaction time stopwatch
	stopwatch.stop()
	
	var current_answer: AnswerRecord = answers_record.back()
	current_answer.reaction_time_in_milliseconds = stopwatch.time_elapsed
	
	# Start response time stopwatch
	stopwatch.reset_and_restart()
