class_name TheoryOfMindController
extends BaseExperimentTask

const QUIZ_KEY: String = "quiz"
const QUESTIONS_KEY: String = "questions"
const SINGLE_QUESTION_KEY: String = "question"
const NARRATION_KEY: String = "narration"
const CORRECT_INDEX_KEY: String = "correctIndex"
const ANSWERS_KEY: String = "answers"

var questions_queue: Array[TheoryOfMindNodeQuestion] = []

func _execute_task() -> void:
	var quiz_questions: Array = current_node_data[QUIZ_KEY]
	max_score = quiz_questions.size()
	questions_queue.clear()
	
	for question: Dictionary in quiz_questions:
		var quiz_single_questions: Array = question[QUESTIONS_KEY]
		var quiz_single_question_index: int = 0
		while quiz_single_question_index < quiz_single_questions.size() :
			var single_question: Dictionary = quiz_single_questions[quiz_single_question_index]
			var node_question: TheoryOfMindNodeQuestion = TheoryOfMindNodeQuestion.new(single_question[SINGLE_QUESTION_KEY], quiz_single_question_index == 0, question[NARRATION_KEY], single_question[CORRECT_INDEX_KEY], single_question[ANSWERS_KEY])
			questions_queue.append(node_question)
			quiz_single_question_index += 1
	
	textbox.choice_made.connect(_on_choice_made)
	_next_question()

func _next_question() -> void:
	if questions_queue.is_empty():
		textbox.choice_made.disconnect(_on_choice_made)
		finish_task() # Tells the manager we are done!
		return
	
	var current_question: TheoryOfMindNodeQuestion = questions_queue.front()
	
	if current_question.is_first:
		var text_data: DialogueData = DialogueData.new(current_question.narration, DialogueData.DialogueTypes.TEXT_ONLY)
		
		textbox.queue_dialogue([text_data])
		textbox.dialogue_completed.connect(_show_question, CONNECT_ONE_SHOT)
	else:
		_show_question()

func _show_question() -> void:
	var current_question: TheoryOfMindNodeQuestion = questions_queue.front()
	var choice_data: DialogueData = DialogueData.new(current_question.narration, DialogueData.DialogueTypes.FIXED_TEXT_WITH_QUESTION_CHOICE, current_question.choices, "", current_question.text)
	
	textbox.queue_dialogue([choice_data])
	textbox.choices_shown.connect(_start_question_timers, CONNECT_ONE_SHOT)

func _on_choice_made(outcome: String) -> void:
	var current_question: TheoryOfMindNodeQuestion = questions_queue.pop_front()
	var is_user_answer_correct: bool = outcome == current_question.choices[current_question.correct_question_index]
	
	_record_answer(outcome, is_user_answer_correct)
	
	_next_question()
