class_name SocialSituationsExerciseAController
extends BaseExperimentTask

const DATA_KEY: String = "data"
const ITEMS_KEY: String = "items"
const SECTIONS_KEY: String = "sections"
const BEFORE_TEXT_KEY: String = "before"
const BOLD_TEXT_KEY: String = "bold"
const AFTER_TEXT_KEY: String = "after"
const ANSWERS_KEY: String = "answers"
const CORRECT_INDEXES_KEY: String = "correctIndexes"
const TEXT_KEY: String = "text"
const EXPLANATION_KEY: String = "explanation"

var questions_queue: Array[SocialSituationsExerciseANodeQuestion] = []

func _execute_task() -> void:
	var current_node_data: Dictionary = current_node_definition[DATA_KEY]
	var items: Array = current_node_data[ITEMS_KEY]
	max_score = items.size()
	questions_queue.clear()
	
	for item in items:
		for section in item[SECTIONS_KEY]:
			var node_choices: Array[SocialSituationsExerciseAChoice] = []
			for answer: Dictionary in section[ANSWERS_KEY]:
				var choice: SocialSituationsExerciseAChoice = SocialSituationsExerciseAChoice.new(answer[TEXT_KEY], answer[EXPLANATION_KEY])
				node_choices.append(choice)
			var node_question: SocialSituationsExerciseANodeQuestion = SocialSituationsExerciseANodeQuestion.new(section[BEFORE_TEXT_KEY], section[BOLD_TEXT_KEY], section[AFTER_TEXT_KEY], node_choices, section[CORRECT_INDEXES_KEY])
			questions_queue.append(node_question)
	
	_next_question()

func _next_question() -> void:
	if questions_queue.is_empty():
		finish_task() # Tells the manager we are done!
		return
	
	var current_question: SocialSituationsExerciseANodeQuestion = questions_queue.front()
	var text_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.TEXT)
	text_data.text_sequence = [current_question.text]
	dialogue_controller.textbox_lock_input()
	dialogue_controller.action_shown.connect(_show_choices, CONNECT_ONE_SHOT)
	dialogue_controller.queue_dialogue(text_data)

func _show_choices() -> void:
	var current_question: SocialSituationsExerciseANodeQuestion = questions_queue.front()
	var choice_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.CHOICES)
	var choices_text: Array[String] = []
	for choice: SocialSituationsExerciseAChoice in current_question.choices:
		choices_text.append(choice.text)
	choice_data.choices = choices_text
	dialogue_controller.action_shown.connect(_start_question_timers, CONNECT_ONE_SHOT)
	dialogue_controller.action_performed.connect(_on_choice_made, CONNECT_ONE_SHOT)
	dialogue_controller.queue_dialogue(choice_data)

func _on_choice_made(outcome: String) -> void:
	dialogue_controller.textbox_unlock_input_and_perform_action()
	
	var current_question: SocialSituationsExerciseANodeQuestion = questions_queue.pop_front()
	
	var choices: Array[SocialSituationsExerciseAChoice] = current_question.choices
	var explanation: String = ""
	var choice_index: int = 0
	while not explanation and choice_index < choices.size():
		var choice: SocialSituationsExerciseAChoice = choices[choice_index]
		if choice.text == outcome:
			explanation = choice.explanation
		else:
			choice_index += 1
	
	var is_user_answer_correct: bool = current_question.correct_choices_index == choice_index
	
	_record_answer(outcome, is_user_answer_correct)
	
	var text_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.TEXT)
	text_data.text_sequence = [explanation]
	dialogue_controller.action_performed.connect(_next_question, CONNECT_ONE_SHOT)
	dialogue_controller.queue_dialogue(text_data)
