class_name EmotionRecognitionExerciseAController
extends BaseExperimentTask

const IMAGE_ID_KEY: String = "imageId"
const ANSWERS_KEY: String = "answers"
const CORRECT_INDEX_KEY: String = "correctIndex"
const EXPLANATION_KEY: String = "explanation"

var questions_queue: Array[EmotionAttributionExerciseANodeQuestion] = []

func _execute_task() -> void:
	max_score = 1
	questions_queue.clear()
	
	var node_question: EmotionRecognitionExerciseANodeQuestion = EmotionRecognitionExerciseANodeQuestion.new(current_node_data[IMAGE_ID_KEY], current_node_data[ANSWERS_KEY], current_node_data[CORRECT_INDEX_KEY], current_node_data[EXPLANATION_KEY])
	questions_queue.append(node_question)
	
	var image_data = DialogueData.new(DialogueData.DialogueTypes.IMAGE)
	var image_url = "%s/images/%s" % [APIManager.API_URL, node_question.image_id]
	image_data.image_urls = [image_url]
	dialogue_controller.queue_dialogue(image_data)
	dialogue_controller.imagebox_textbox_lock_input()
	dialogue_controller.action_shown.connect(_show_choices, CONNECT_ONE_SHOT)

func _show_choices() -> void:
	var current_question: EmotionRecognitionExerciseANodeQuestion = questions_queue.front()
	var choice_data = DialogueData.new(DialogueData.DialogueTypes.CHOICES)
	choice_data.choices = current_question.choices
	dialogue_controller.queue_dialogue(choice_data)
	dialogue_controller.action_shown.connect(_start_question_timers, CONNECT_ONE_SHOT)
	dialogue_controller.action_performed.connect(_on_choice_made, CONNECT_ONE_SHOT)

func _on_choice_made(outcome: String) -> void:
	dialogue_controller.imagebox_textbox_unlock_input_and_perform_action()
	
	var current_question: EmotionRecognitionExerciseANodeQuestion = questions_queue.pop_front()
	var is_user_answer_correct: bool = outcome == current_question.choices[current_question.correct_choice_index]
	
	_record_answer(outcome, is_user_answer_correct)
	
	var text_data = DialogueData.new(DialogueData.DialogueTypes.TEXT)
	text_data.text_sequence = [current_question.explanation]
	dialogue_controller.queue_dialogue(text_data)
	dialogue_controller.action_performed.connect(finish_task, CONNECT_ONE_SHOT)
