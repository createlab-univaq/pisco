class_name EmotionAttributionExerciseAController
extends BaseExperimentTask

const DATA_KEY: String = "data"
const SCENARIO_KEY: String = "scenario"
const DOMANDA_KEY: String = "domanda"
const RISPOSTE_CORRETTE_KEY: String = "risposteCorrette"
const CORRECT_ANSWER_EXPLAINATION_KEY: String = "spiegazioneR"
const SCENARIO_EXPLAINATION_KEY: String = "spiegazioneS"

var questions_queue: Array[EmotionAttributionExerciseANodeQuestion] = []

func _execute_task() -> void:
	var current_node_data: Dictionary = current_node_definition[DATA_KEY]
	max_score = 1
	questions_queue.clear()
	
	var node_question: EmotionAttributionExerciseANodeQuestion = EmotionAttributionExerciseANodeQuestion.new(current_node_data[SCENARIO_KEY], current_node_data[DOMANDA_KEY], current_node_data[RISPOSTE_CORRETTE_KEY], current_node_data[CORRECT_ANSWER_EXPLAINATION_KEY], current_node_data[SCENARIO_EXPLAINATION_KEY])
	questions_queue.append(node_question)
	
	var text_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.TEXT)
	text_data.text_sequence = [node_question.scenario]
	dialogue_controller.textbox_lock_input()
	dialogue_controller.action_shown.connect(_show_question, CONNECT_ONE_SHOT)
	dialogue_controller.queue_dialogue(text_data)

func _show_question() -> void:
	var node_question: EmotionAttributionExerciseANodeQuestion = questions_queue.pop_front()
	var text_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.QUESTION)
	text_data.text_sequence = [node_question.text]
	dialogue_controller.question_textbox_lock_input()
	dialogue_controller.action_shown.connect(_show_input, CONNECT_ONE_SHOT)
	dialogue_controller.queue_dialogue(text_data)

func _show_input() -> void:
	var input_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.INPUT)
	dialogue_controller.action_shown.connect(_start_question_timers, CONNECT_ONE_SHOT)
	dialogue_controller.action_performed.connect(_on_text_submitted, CONNECT_ONE_SHOT)
	dialogue_controller.queue_dialogue(input_data)

func _on_text_submitted(submitted_text: String) -> void:
	dialogue_controller.textbox_unlock_input_and_perform_action()
	dialogue_controller.question_textbox_unlock_input_and_perform_action()
	
	var node_question: EmotionAttributionExerciseANodeQuestion = questions_queue.pop_front()
	var is_user_answer_correct: bool = false
	var correct_answer_index: int = 0
	var correct_answers: Array[String] = node_question.correct_answers
	while not is_user_answer_correct and correct_answer_index < correct_answers.size():
		var current_correct_answer: String = correct_answers[correct_answer_index].to_lower()
		is_user_answer_correct = current_correct_answer == submitted_text.to_lower()
		correct_answer_index += 1
	
	_record_answer(submitted_text, is_user_answer_correct)
	
	# show explainations
	var text_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.TEXT)
	text_data.text_sequence = [node_question.scenario_explaination]
	dialogue_controller.action_performed.connect(_show_answer_explanation)
	dialogue_controller.queue_dialogue(text_data)

func _show_answer_explanation() -> void:
	var node_question: EmotionAttributionExerciseANodeQuestion = questions_queue.pop_front()
	var text_data: DialogueData = DialogueData.new(DialogueData.DialogueTypes.TEXT)
	text_data.text_sequence = [node_question.correct_answer_explaination]
	dialogue_controller.action_performed.connect(finish_task)
	dialogue_controller.queue_dialogue(text_data)
