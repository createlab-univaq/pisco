class_name EmotionAttributionExerciseBController
extends BaseExperimentTask

const ITEMS_KEY: String = "items"
const SCENARIO_KEY: String = "scenario"
const EMOTION_KEY: String = "emotion"
const EXPLANATION_KEY: String = "explanation"

var questions_queue: Array[EmotionAttributionExerciseBNodeQuestion] = []

func _execute_task() -> void:
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
	var scenario_dialogue_text_data: DialogueData = DialogueData.new(current_question.scenario, DialogueData.DialogueTypes.TEXT_ONLY)
	
	textbox.queue_dialogue([scenario_dialogue_text_data])
	textbox.dialogue_completed.connect(_on_scenario_dialogue_completed, CONNECT_ONE_SHOT)

func _on_scenario_dialogue_completed() -> void:
	var current_question: EmotionAttributionExerciseBNodeQuestion = questions_queue.front()
	var explanation_and_emotion_text_data: DialogueData = DialogueData.new(current_question.scenario, DialogueData.DialogueTypes.QUESTION_WITH_TEXT_ONLY, [], "", current_question.emotion)
	textbox.queue_dialogue([explanation_and_emotion_text_data])
	
	textbox.dialogue_text_shown.connect(_start_question_timers, CONNECT_ONE_SHOT)
	textbox.dialogue_completed.connect(_on_explanation_and_emotion_dialogue_completed, CONNECT_ONE_SHOT)

func _on_explanation_and_emotion_dialogue_completed() -> void:
	_record_answer(null, true)
	
	_next_question()
