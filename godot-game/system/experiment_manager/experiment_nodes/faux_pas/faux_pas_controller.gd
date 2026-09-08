class_name FauxPasControler
extends BaseExperimentTask

const DATA_KEY: String = "data"
const QUIZ_KEY: String = "quiz"
const QUESTIONS_KEY: String = "questions"
const SKIP_IF_KEY: String = "skipIf"
const ENABLED_KEY: String = "enabled"
const QUESTION_INDEX: String = "questionIndex"
const ANSWERS_KEY: String = "answers"
const ANSWER_INDEX: String = "answerIndex"
const SINGLE_QUESTION_KEY: String = "question"
const NARRATION_KEY: String = "narration"
const CORRECT_INDEX_KEY: String = "correctIndex"

var questions_queue: Array[FauxPasNodeQuestion] = []

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
			var skip_question: FauxPasSkipQuestion = null
			var skip_if: Dictionary = single_question[SKIP_IF_KEY]
			if skip_if[ENABLED_KEY]:
				var skip_if_question_index: int = skip_if[QUESTION_INDEX]
				var skip_if_question: Dictionary = quiz_single_questions[skip_if_question_index]
				var skip_if_question_answer: String = skip_if_question[ANSWERS_KEY][skip_if[ANSWER_INDEX]]
				skip_question = FauxPasSkipQuestion.new(skip_if_question_index, skip_if_question_answer)
			var raw_choices: Array = single_question[ANSWERS_KEY]
			var typed_choices: Array[String] = []
			typed_choices.assign(raw_choices)
			var node_question: FauxPasNodeQuestion = FauxPasNodeQuestion.new(
				single_question[SINGLE_QUESTION_KEY], 
				quiz_single_question_index == 0, 
				quiz_single_question_index == quiz_single_questions.size() - 1, 
				question[NARRATION_KEY], 
				single_question[CORRECT_INDEX_KEY], 
				typed_choices,
				skip_question
			)
			questions_queue.append(node_question)
			quiz_single_question_index += 1
	
	_next_question()

func _next_question() -> void:
	if questions_queue.is_empty():
		finish_task()
		return
	
	var current_question: FauxPasNodeQuestion = questions_queue.front()
	if not answers_record.is_empty():
		var skip_question: FauxPasSkipQuestion = current_question.skip_question
		var is_skip_question: bool = true
		while is_skip_question and not questions_queue.is_empty():
			if skip_question:
				is_skip_question = answers_record[skip_question.question_index].user_answer == skip_question.question_answer
			else:
				is_skip_question = false
			if is_skip_question:
				# skip current answer
				questions_queue.pop_front()
				current_question = questions_queue.front()
				skip_question = current_question.skip_question
	
	if questions_queue.is_empty():
		finish_task()
		return
	
	if current_question.is_first:
		var narration_text_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.TEXT)
		narration_text_data.text_sequence = [current_question.narration]
		dialogue_controller.action_shown.connect(_show_question, CONNECT_ONE_SHOT)
		dialogue_controller.queue_dialogue(narration_text_data)
	else:
		_show_question()

func _show_question() -> void:
	dialogue_controller.textbox_lock_input()
	var current_question: FauxPasNodeQuestion = questions_queue.front()
	var question_text_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.QUESTION)
	question_text_data.text_sequence = [current_question.text]
	dialogue_controller.action_shown.connect(_show_choices, CONNECT_ONE_SHOT)
	dialogue_controller.queue_dialogue(question_text_data)

func _show_choices() -> void:
	dialogue_controller.question_textbox_lock_input()
	var current_question: FauxPasNodeQuestion = questions_queue.front()
	var choice_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.CHOICES)
	choice_data.choices = current_question.choices
	dialogue_controller.action_shown.connect(_start_question_timers, CONNECT_ONE_SHOT)
	dialogue_controller.action_performed.connect(_on_choice_made, CONNECT_ONE_SHOT)
	dialogue_controller.queue_dialogue(choice_data)

func _on_choice_made(outcome: String) -> void:
	dialogue_controller.question_textbox_unlock_input_and_perform_action()
	
	var current_question: FauxPasNodeQuestion = questions_queue.pop_front()
	var is_user_answer_correct: bool = outcome == current_question.choices[current_question.correct_question_index]
	
	_record_answer(outcome, is_user_answer_correct)
	
	if current_question.is_last:
		dialogue_controller.textbox_unlock_input_and_perform_action()
	
	_next_question()
