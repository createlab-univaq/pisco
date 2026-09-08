class_name TheoryOfMindExerciseAController
extends BaseExperimentTask

const DATA_KEY: String = "data"
const QUIZ_KEY: String = "quiz"
const QUESTIONS_KEY: String = "questions"
const SINGLE_QUESTION_KEY: String = "question"
const CAPTION_KEY: String = "caption"
const CORRECT_INDEX_KEY: String = "correctIndex"
const ANSWERS_KEY: String = "answers"
const EXPLANATION_KEY: String = "explanation"
const IMAGE_ID_KEY: String = "imageId"

var questions_queue: Array[TheoryOfMindExerciseANodeQuestion] = []

func _execute_task() -> void:
	var current_node_data: Dictionary = current_node_definition[DATA_KEY]
	var quiz_questions: Array = current_node_data[QUIZ_KEY]
	max_score = quiz_questions.size()
	questions_queue.clear()
	
	for question: Dictionary in quiz_questions:
		var quiz_single_questions: Array = question[QUESTIONS_KEY]
		var quiz_single_question_index: int = 0
		while quiz_single_question_index < quiz_single_questions.size() :
			var single_question: Dictionary = quiz_single_questions[quiz_single_question_index]
			var node_question: TheoryOfMindExerciseANodeQuestion = TheoryOfMindExerciseANodeQuestion.new(single_question[SINGLE_QUESTION_KEY], quiz_single_question_index == 0, quiz_single_question_index == quiz_single_questions.size() - 1, question[IMAGE_ID_KEY], question[CAPTION_KEY], single_question[ANSWERS_KEY], single_question[CORRECT_INDEX_KEY], single_question[EXPLANATION_KEY])
			questions_queue.append(node_question)
			quiz_single_question_index += 1
	
	_next_question()

func _next_question() -> void:
	if questions_queue.is_empty():
		finish_task() # Tells the manager we are done!
		return
	
	var current_question: TheoryOfMindExerciseANodeQuestion = questions_queue.front()
	
	if current_question.is_first:
		var image_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.IMAGE)
		image_data.image_urls = [current_question.image_url]
		dialogue_controller.action_shown.connect(_show_caption, CONNECT_ONE_SHOT)
		dialogue_controller.queue_dialogue(image_data)
	else:
		_show_question()

func _show_caption() -> void:
	dialogue_controller.imagebox_textbox_lock_input()
	var current_question: TheoryOfMindExerciseANodeQuestion = questions_queue.front()
	var text_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.TEXT)
	text_data.text_sequence = [current_question.caption]
	dialogue_controller.action_shown.connect(_show_question, CONNECT_ONE_SHOT)
	dialogue_controller.queue_dialogue(text_data)

func _show_question() -> void:
	dialogue_controller.textbox_lock_input()
	var current_question: TheoryOfMindExerciseANodeQuestion = questions_queue.front()
	var text_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.QUESTION)
	text_data.text_sequence = [current_question.text]
	dialogue_controller.action_shown.connect(_show_choices, CONNECT_ONE_SHOT)
	dialogue_controller.queue_dialogue(text_data)

func _show_choices() -> void:
	dialogue_controller.question_textbox_lock_input()
	var current_question: TheoryOfMindExerciseANodeQuestion = questions_queue.front()
	var choice_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.CHOICES)
	choice_data.choices = current_question.choices
	dialogue_controller.action_shown.connect(_start_question_timers, CONNECT_ONE_SHOT)
	dialogue_controller.action_performed.connect(_on_choice_made, CONNECT_ONE_SHOT)
	dialogue_controller.queue_dialogue(choice_data)

func _on_choice_made(outcome: String) -> void:
	dialogue_controller.question_textbox_unlock_input_and_perform_action()
	
	var current_question: TheoryOfMindExerciseANodeQuestion = questions_queue.pop_front()
	var is_user_answer_correct: bool = outcome == current_question.choices[current_question.correct_question_index]
	
	_record_answer(outcome, is_user_answer_correct)
	
	if current_question.is_last:
		dialogue_controller.textbox_unlock_input_and_perform_action()
		
		var text_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.TEXT)
		text_data.text_sequence = [current_question.explanation]
		dialogue_controller.action_performed.connect(_on_explaination_dialogue_completed, CONNECT_ONE_SHOT)
		dialogue_controller.queue_dialogue(text_data)
	else:
		_next_question()

func _on_explaination_dialogue_completed() -> void:
	dialogue_controller.imagebox_textbox_unlock_input_and_perform_action()
	
	_next_question()
