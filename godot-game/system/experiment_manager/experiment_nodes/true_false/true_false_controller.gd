class_name TrueFalseController
extends BaseExperimentTask

const QUESTIONS_KEY: String = "questions"
const IS_QUESTION_CORRECT_KEY: String = "isQuestionCorrect"
const INSTRUCTIONS_KEY: String = "instructions"
const TRUE_CHOICE_KEY: String = "Vero"
const FALSE_CHOICE_KEY: String = "False"

var questions_queue: Array[TrueFalseNodeQuestion] = []

func _execute_task() -> void:
	var questions: Array = current_node_data[QUESTIONS_KEY]
	max_score = questions.size()
	questions_queue.clear()
	
	var correct_questions: Array = current_node_data[IS_QUESTION_CORRECT_KEY]
	
	assert(questions.size() == correct_questions.size(), "Questions and answers do not match")
	
	for index in range(questions.size()):
		var node_question: TrueFalseNodeQuestion = TrueFalseNodeQuestion.new(questions[index], correct_questions[index])
		questions_queue.append(node_question)
	
	var instructions_text_data: DialogueData = DialogueData.new(current_node_data[INSTRUCTIONS_KEY], DialogueData.DialogueTypes.TEXT_ONLY)
	textbox.queue_dialogue([instructions_text_data])
	textbox.dialogue_completed.connect(_on_instruction_dialogue_completed, CONNECT_ONE_SHOT)

func _on_instruction_dialogue_completed() -> void:
	textbox.choice_made.connect(_on_choice_made)
	_next_question()

func _next_question() -> void:
	if questions_queue.is_empty():
		textbox.choice_made.disconnect(_on_choice_made)
		finish_task() # Tells the manager we are done!
		return
	
	var current_question: TrueFalseNodeQuestion = questions_queue.front()
	var choice_data: DialogueData = DialogueData.new(current_question.text, DialogueData.DialogueTypes.CHOICES, [TRUE_CHOICE_KEY, FALSE_CHOICE_KEY])
	textbox.queue_dialogue([choice_data])
	textbox.choices_shown.connect(_start_question_timers, CONNECT_ONE_SHOT)

func _on_choice_made(outcome: String) -> void:
	var current_question: TrueFalseNodeQuestion = questions_queue.pop_front()
	var is_has_user_selected_true: bool = outcome == TRUE_CHOICE_KEY
	var is_user_answer_correct: bool = is_has_user_selected_true == current_question.is_true
	
	_record_answer(outcome, is_user_answer_correct)
	
	_next_question()
