class_name EmotionAttributionController
extends BaseExperimentTask

const QUESTIONS_KEY: String = "questions"
const NARRATION_KEY: String = "narration"
const SINGLE_QUESTION_KEY: String = "question"
const CORRECT_ANSWERS_KEY: String = "correctAnswers"

var questions_queue: Array[EmotionAttributionNodeQuestion] = []

func _execute_task() -> void:
	var questions: Array = current_node_data[QUESTIONS_KEY]
	max_score = questions.size()
	questions_queue.clear()
	
	for question: Dictionary in questions:
		var node_question: EmotionAttributionNodeQuestion = EmotionAttributionNodeQuestion.new(question[NARRATION_KEY], question[SINGLE_QUESTION_KEY], question[CORRECT_ANSWERS_KEY])
		questions_queue.append(node_question)
	
	_next_question()

func _next_question() -> void:
	if questions_queue.is_empty():
		finish_task() # Tells the manager we are done!
		return
	
	var current_question: EmotionAttributionNodeQuestion = questions_queue.front()
	var text_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.TEXT)
	text_data.text_sequence = [current_question.narration]
	dialogue_controller.queue_dialogue(text_data)
	dialogue_controller.textbox_lock_input()
	dialogue_controller.action_shown.connect(_show_question, CONNECT_ONE_SHOT)

func _show_question() -> void:
	var current_question: EmotionAttributionNodeQuestion = questions_queue.front()
	var question_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.QUESTION)
	question_data.text_sequence = [current_question.question]
	dialogue_controller.queue_dialogue(question_data)
	dialogue_controller.question_textbox_lock_input()
	dialogue_controller.action_shown.connect(_show_input, CONNECT_ONE_SHOT)

func _show_input() -> void:
	var input_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.INPUT)
	dialogue_controller.queue_dialogue(input_data)
	dialogue_controller.action_shown.connect(_start_question_timers, CONNECT_ONE_SHOT)
	dialogue_controller.action_performed.connect(_on_text_submitted, CONNECT_ONE_SHOT)

func _on_text_submitted(submitted_text: String) -> void:
	dialogue_controller.textbox_unlock_input_and_perform_action()
	dialogue_controller.question_textbox_unlock_input_and_perform_action()
	
	var current_question: EmotionAttributionNodeQuestion = questions_queue.pop_front()
	var is_user_answer_correct: bool = false
	var correct_answer_index: int = 0
	var correct_answers: Array[String] = current_question.correct_answers
	while not is_user_answer_correct and correct_answer_index < correct_answers.size():
		var current_correct_answer: String = correct_answers[correct_answer_index].to_lower()
		is_user_answer_correct = current_correct_answer == submitted_text.to_lower()
		correct_answer_index += 1
	
	_record_answer(submitted_text, is_user_answer_correct)
	
	_next_question()
