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
	
	textbox.text_submitted.connect(_on_text_submitted)
	_next_question()

func _next_question() -> void:
	if questions_queue.is_empty():
		textbox.text_submitted.disconnect(_on_text_submitted)
		finish_task() # Tells the manager we are done!
		return
	
	var current_question: EmotionAttributionNodeQuestion = questions_queue.front()
	var text_input_data: DialogueData = DialogueData.new(current_question.narration, DialogueData.DialogueTypes.TEXT_WITH_QUESTION_INPUT, [], "", current_question.question)
	
	textbox.queue_dialogue([text_input_data])
	textbox.text_input_shown.connect(_start_question_timers, CONNECT_ONE_SHOT)

func _on_text_submitted(submitted_text: String) -> void:
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
