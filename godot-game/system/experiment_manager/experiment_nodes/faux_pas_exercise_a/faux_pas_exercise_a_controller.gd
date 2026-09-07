class_name FauxPasExerciseAController
extends BaseExperimentTask

const QUIZ_KEY: String = "quiz"
const QUESTIONS_KEY: String = "questions"
const SKIP_IF_KEY: String = "skipIf"
const QUESTION_INDEX: String = "questionIndex"
const ENABLED_KEY: String = "enabled"
const ANSWERS_KEY: String = "answers"
const ANSWER_INDEX: String = "answerIndex"
const SINGLE_QUESTION_KEY: String = "question"
const NARRATION_KEY: String = "narration"
const CORRECT_INDEX_KEY: String = "correctIndex"
const EXPLANATION_KEY: String = "explanation"

var questions_queue: Array[EyesTaskNodeQuestion] = []

func _execute_task() -> void:
	var quiz_questions: Array = current_node_data[QUIZ_KEY]
	max_score = quiz_questions.size()
	questions_queue.clear()
	
	for question: Dictionary in quiz_questions:
		var quiz_single_questions: Array = question[QUESTIONS_KEY]
		var quiz_single_question_index: int = 0
		while quiz_single_question_index < quiz_single_questions.size() :
			var single_question: Dictionary = quiz_single_questions[quiz_single_question_index]
			var skip_question: FauxPasExerciseASkipQuestion = null
			var skip_if: Dictionary = single_question[SKIP_IF_KEY]
			if skip_if[ENABLED_KEY]:
				var skip_if_question_index: int = skip_if[QUESTION_INDEX]
				var skip_if_question: Dictionary = quiz_single_questions[skip_if_question_index]
				var skip_if_question_answer: String = skip_if_question[ANSWERS_KEY][skip_if[ANSWER_INDEX]]
				skip_question = FauxPasExerciseASkipQuestion.new(skip_if_question_index, skip_if_question_answer)
			var node_question: FauxPasExerciseANodeQuestion = FauxPasExerciseANodeQuestion.new(single_question[SINGLE_QUESTION_KEY], quiz_single_question_index == 0, quiz_single_question_index == quiz_single_questions.size() - 1, question[NARRATION_KEY], single_question[CORRECT_INDEX_KEY], single_question[ANSWERS_KEY], skip_question, question[EXPLANATION_KEY])
			questions_queue.append(node_question)
			quiz_single_question_index += 1
	
	textbox.choice_made.connect(_on_choice_made)
	_next_question()

func _next_question() -> void:
	if questions_queue.is_empty():
		_on_questions_finished()
		return
	
	var current_question: FauxPasExerciseANodeQuestion = questions_queue.front()
	var skip_question: FauxPasExerciseASkipQuestion = current_question.skip_question
	var is_skip_question: bool = true
	while is_skip_question and not questions_queue.is_empty():
		is_skip_question = answers_record[skip_question.answer_index].user_answer == skip_question.question_answer
		if is_skip_question:
			# skip current answer
			questions_queue.pop_front()
			current_question = questions_queue.front()
			skip_question = current_question.skip_question
	
	if questions_queue.is_empty():
		_on_questions_finished()
		return
	
	if current_question.is_first:
		var text_data: DialogueData = DialogueData.new(current_question.narration, DialogueData.DialogueTypes.TEXT_ONLY)
		
		textbox.queue_dialogue([text_data])
		textbox.dialogue_completed.connect(_show_question, CONNECT_ONE_SHOT)
	else:
		_show_question()

func _show_question() -> void:
	var current_question: FauxPasExerciseANodeQuestion = questions_queue.front()
	var choice_data: DialogueData = DialogueData.new(current_question.narration, DialogueData.DialogueTypes.FIXED_TEXT_WITH_QUESTION_CHOICE, current_question.choices, "", current_question.text)
	
	textbox.queue_dialogue([choice_data])
	textbox.choices_shown.connect(_start_question_timers, CONNECT_ONE_SHOT)

func _on_questions_finished() -> void:
	textbox.choice_made.disconnect(_on_choice_made)
	finish_task() # Tells the manager we are done!

func _on_choice_made(outcome: String) -> void:
	var current_question: FauxPasExerciseANodeQuestion = questions_queue.pop_front()
	var is_user_answer_correct: bool = outcome == current_question.choices[current_question.correct_question_index]
	
	_record_answer(outcome, is_user_answer_correct)
	
	if current_question.is_last:
		var explanation_text_data: DialogueData = DialogueData.new(current_question.explanation, DialogueData.DialogueTypes.TEXT_ONLY)
		
		textbox.queue_dialogue([explanation_text_data])
		textbox.dialogue_completed.connect(_next_question, CONNECT_ONE_SHOT)
	else:
		_next_question()
