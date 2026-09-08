class_name EmotionAttributionExerciseBController
extends BaseExperimentTask

const DATA_KEY: String = "data"
const ITEMS_KEY: String = "items"
const SCENARIO_KEY: String = "scenario"
const EMOTION_KEY: String = "emotion"
const EXPLANATION_KEY: String = "explanation"

var questions_queue: Array[EmotionAttributionExerciseBNodeQuestion] = []

func _execute_task() -> void:
	var current_node_data: Dictionary = current_node_definition[DATA_KEY]
	var items: Array = current_node_data[ITEMS_KEY]
	max_score = items.size()
	questions_queue.clear()
	
	for item: Dictionary in items:
		var node_question: EmotionAttributionExerciseBNodeQuestion = EmotionAttributionExerciseBNodeQuestion.new(item[SCENARIO_KEY], item[EMOTION_KEY], item[EXPLANATION_KEY])
		questions_queue.append(node_question)
	
	_next_question()

func _next_question() -> void:
	if questions_queue.is_empty():
		finish_task() # Tells the manager we are done!
		return
	
	var current_question: EmotionAttributionExerciseBNodeQuestion = questions_queue.front()
	var text_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.QUESTION)
	text_data.text_sequence = [current_question.emotion]
	dialogue_controller.queue_dialogue(text_data)
	dialogue_controller.question_textbox_lock_input()
	dialogue_controller.action_shown.connect(_show_scenario, CONNECT_ONE_SHOT)

func _show_scenario() -> void:
	var current_question: EmotionAttributionExerciseBNodeQuestion = questions_queue.front()
	var text_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.TEXT)
	text_data.text_sequence = [current_question.scenario]
	dialogue_controller.action_performed.connect(_show_explanation, CONNECT_ONE_SHOT)

func _show_explanation() -> void:
	var current_question: EmotionAttributionExerciseBNodeQuestion = questions_queue.front()
	var text_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.TEXT)
	text_data.text_sequence = [current_question.explanation]
	dialogue_controller.action_shown.connect(_start_question_timers, CONNECT_ONE_SHOT)
	dialogue_controller.action_performed.connect(_on_explanation_and_emotion_dialogue_completed, CONNECT_ONE_SHOT)

func _on_explanation_and_emotion_dialogue_completed() -> void:
	dialogue_controller.question_textbox_unlock_input_and_perform_action()
	
	_record_answer(null, true)
	
	_next_question()
