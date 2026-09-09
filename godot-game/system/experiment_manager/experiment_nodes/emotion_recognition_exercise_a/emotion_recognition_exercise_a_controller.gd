class_name EmotionRecognitionExerciseAController
extends BaseExperimentTask

const DATA_KEY: String = "data"
const IMAGE_ID_KEY: String = "imageId"
const ANSWERS_KEY: String = "answers"
const CORRECT_INDEX_KEY: String = "correctIndex"
const EXPLANATION_KEY: String = "explanation"

var questions_queue: Array[EmotionRecognitionExerciseANodeQuestion] = []

func _execute_task() -> void:
	var current_node_data: Dictionary = current_node_definition[DATA_KEY]
	max_score = 1
	questions_queue.clear()
	
	var raw_choices: Array = current_node_data[ANSWERS_KEY]
	var typed_choices: Array[String] = []
	typed_choices.assign(raw_choices)
	var node_question: EmotionRecognitionExerciseANodeQuestion = EmotionRecognitionExerciseANodeQuestion.new(
		current_node_data[IMAGE_ID_KEY], 
		typed_choices,
		current_node_data[CORRECT_INDEX_KEY], 
		current_node_data[EXPLANATION_KEY]
	)
	questions_queue.append(node_question)
	
	var image_data = DialogueData.new(DialogueData.DialogueTypes.IMAGE)
	var image_url = "%s/images/%s" % [APIManager.API_URL, node_question.image_id]
	var image_urls: Array[String] = [image_url]
	image_data.image_urls = image_urls
	dialogue_controller.action_shown.connect(_show_choices, CONNECT_ONE_SHOT)
	dialogue_controller.queue_dialogue(image_data)

func _show_choices() -> void:
	dialogue_controller.imagebox_textbox_lock_input()
	var current_question: EmotionRecognitionExerciseANodeQuestion = questions_queue.front()
	var choice_data = DialogueData.new(DialogueData.DialogueTypes.CHOICES)
	choice_data.choices = current_question.choices
	dialogue_controller.action_shown.connect(_start_question_timers, CONNECT_ONE_SHOT)
	dialogue_controller.action_performed.connect(_on_choice_made, CONNECT_ONE_SHOT)
	dialogue_controller.queue_dialogue(choice_data)

func _on_choice_made(outcome: String) -> void:
	dialogue_controller.imagebox_textbox_unlock_input_and_perform_action()
	
	var current_question: EmotionRecognitionExerciseANodeQuestion = questions_queue.pop_front()
	var is_user_answer_correct: bool = outcome == current_question.choices[current_question.correct_choice_index]
	
	_record_answer(outcome, is_user_answer_correct)
	
	var text_data = DialogueData.new(DialogueData.DialogueTypes.TEXT)
	var explanation_sequence: Array[String] = [current_question.explanation]
	text_data.text_sequence = explanation_sequence
	dialogue_controller.action_performed.connect(_on_explanation_dialogue_completed, CONNECT_ONE_SHOT)
	dialogue_controller.queue_dialogue(text_data)

func _on_explanation_dialogue_completed(_output: Variant) -> void:
	finish_task()
