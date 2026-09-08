class_name SocialSituationsController
extends BaseExperimentTask

const DATA_KEY: String = "data"
const ITEMS_KEY: String = "items"
const SECTIONS_KEY: String = "sections"
const BEFORE_TEXT_KEY: String = "before"
const BOLD_TEXT_KEY: String = "bold"
const AFTER_TEXT_KEY: String = "after"
const ANSWERS_KEY: String = "answers"
const CORRECT_INDEXES_KEY: String = "correctIndexes"

var questions_queue: Array[SocialSituationsNodeQuestion] = []

func _execute_task() -> void:
	var current_node_data: Dictionary = current_node_definition[DATA_KEY]
	var items: Array = current_node_data[ITEMS_KEY]
	max_score = items.size()
	questions_queue.clear()
	
	for item in items:
		for section in item[SECTIONS_KEY]:
			var node_question: SocialSituationsNodeQuestion = SocialSituationsNodeQuestion.new(section[BEFORE_TEXT_KEY], section[BOLD_TEXT_KEY], section[AFTER_TEXT_KEY], section[ANSWERS_KEY], section[CORRECT_INDEXES_KEY])
			questions_queue.append(node_question)
	
	_next_question()

func _next_question() -> void:
	if questions_queue.is_empty():
		finish_task() # Tells the manager we are done!
		return
	
	var current_question: SocialSituationsNodeQuestion = questions_queue.front()
	var text_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.TEXT)
	text_data.text_sequence = [current_question.text]
	dialogue_controller.textbox_lock_input()
	dialogue_controller.action_shown.connect(_show_choices, CONNECT_ONE_SHOT)
	dialogue_controller.queue_dialogue(text_data)

func _show_choices() -> void:
	var current_question: SocialSituationsNodeQuestion = questions_queue.front()
	var choice_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.CHOICES)
	choice_data.choices = current_question.choices
	dialogue_controller.action_shown.connect(_start_question_timers, CONNECT_ONE_SHOT)
	dialogue_controller.action_performed.connect(_on_choice_made, CONNECT_ONE_SHOT)

func _on_choice_made(outcome: String) -> void:
	dialogue_controller.textbox_unlock_input_and_perform_action()
	
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
