class_name EyesTaskController
extends BaseExperimentTask

const DATA_KEY: String = "data"
const QUESTIONS_KEY: String = "questions"
const IMAGE_ID_KEY: String = "imageId"
const ANSWERS_KEY: String = "answers"
const CORRECT_INDEX_KEY: String = "correctIndex"

var questions_queue: Array[EyesTaskNodeQuestion] = []

func _execute_task() -> void:
	var current_node_data: Dictionary = current_node_definition[DATA_KEY]
	var questions: Array = current_node_data[QUESTIONS_KEY]
	max_score = questions.size()
	questions_queue.clear()
	
	for question in questions:
		var node_question: EyesTaskNodeQuestion = EyesTaskNodeQuestion.new(question[IMAGE_ID_KEY], question[ANSWERS_KEY], question[CORRECT_INDEX_KEY])
		questions_queue.append(node_question)
	
	_next_question()

func _next_question() -> void:
	if questions_queue.is_empty():
		finish_task() # Tells the manager we are done!
		return
		
	var current_question: EyesTaskNodeQuestion = questions_queue.front()
	var image_data = DialogueData.new(DialogueData.DialogueTypes.IMAGE)
	var image_url = "%s/images/%s" % [APIManager.API_URL, current_question.image_id]
	image_data.image_urls = [image_url]
	dialogue_controller.imagebox_textbox_lock_input()
	dialogue_controller.action_shown.connect(_show_choices, CONNECT_ONE_SHOT)
	dialogue_controller.queue_dialogue(image_data)

func _show_choices() -> void:
	var current_question: EyesTaskNodeQuestion = questions_queue.front()
	var choice_data = DialogueData.new(DialogueData.DialogueTypes.CHOICES)
	choice_data.choices = current_question.choices
	dialogue_controller.action_shown.connect(_start_question_timers, CONNECT_ONE_SHOT)
	dialogue_controller.action_performed.connect(_on_choice_made, CONNECT_ONE_SHOT)
	dialogue_controller.queue_dialogue(choice_data)

func _on_choice_made(outcome: String) -> void:
	dialogue_controller.imagebox_textbox_unlock_input_and_perform_action()
	
	var current_question: EyesTaskNodeQuestion = questions_queue.pop_front()
	var is_user_answer_correct: bool = outcome == current_question.choices[current_question.correct_choice_index]
	
	_record_answer(outcome, is_user_answer_correct)
	_next_question()
