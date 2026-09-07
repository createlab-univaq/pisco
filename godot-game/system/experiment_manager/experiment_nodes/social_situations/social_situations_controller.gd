class_name SocialSituationsController
extends BaseExperimentTask

const ITEMS_KEY: String = "items"
const SECTIONS_KEY: String = "sections"
const BEFORE_TEXT_KEY: String = "before"
const BOLD_TEXT_KEY: String = "bold"
const AFTER_TEXT_KEY: String = "after"
const ANSWERS_KEY: String = "answers"
const CORRECT_INDEXES_KEY: String = "correctIndexes"

var questions_queue: Array[SocialSituationsNodeQuestion] = []

func _execute_task() -> void:
	var items: Array = current_node_data[ITEMS_KEY]
	max_score = items.size()
	questions_queue.clear()
	
	for item in items:
		for section in item[SECTIONS_KEY]:
			var node_question: SocialSituationsNodeQuestion = SocialSituationsNodeQuestion.new(section[BEFORE_TEXT_KEY], section[BOLD_TEXT_KEY], section[AFTER_TEXT_KEY], section[ANSWERS_KEY], section[CORRECT_INDEXES_KEY])
			questions_queue.append(node_question)
	
	textbox.choice_made.connect(_on_choice_made)
	_next_question()

func _next_question() -> void:
	if questions_queue.is_empty():
		textbox.choice_made.disconnect(_on_choice_made)
		finish_task() # Tells the manager we are done!
		return
	
	var current_question: SocialSituationsNodeQuestion = questions_queue.front()
	var choice_data: DialogueData = DialogueData.new(current_question.text, DialogueData.DialogueTypes.CHOICES, current_question.choices)
	
	textbox.queue_dialogue([choice_data])
	textbox.choices_shown.connect(_start_question_timers, CONNECT_ONE_SHOT)

func _on_choice_made(outcome: String) -> void:
	var current_question: SocialSituationsNodeQuestion = questions_queue.pop_front()
	var choices: Array[String] = current_question.choices
	var is_user_answer_correct: bool = false
	var correct_answer_index_cursor: int = 0
	var correct_answers_indexes: Array[int] = current_question.correct_choices_indexes
	while not is_user_answer_correct and correct_answer_index_cursor < correct_answers_indexes.size():
		var current_correct_answer_index: int = correct_answers_indexes[correct_answer_index_cursor]
		var current_correct_answer: String = choices[current_correct_answer_index].to_lower()
		is_user_answer_correct = current_correct_answer == outcome.to_lower()
		correct_answer_index_cursor += 1
	
	_record_answer(outcome, is_user_answer_correct)
	
	_next_question()
