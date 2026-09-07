class_name EmotionAttributionExerciseAController
extends BaseExperimentTask

const SCENARIO_KEY: String = "scenario"
const DOMANDA_KEY: String = "domanda"
const RISPOSTE_CORRETTE_KEY: String = "risposteCorrette"
const CORRECT_ANSWER_EXPLAINATION_KEY: String = "spiegazioneR"
const SCENARIO_EXPLAINATION_KEY: String = "spiegazioneS"

var questions_queue: Array[EmotionAttributionExerciseANodeQuestion] = []

func _execute_task() -> void:
	max_score = 1
	questions_queue.clear()
	
	var node_question: EmotionAttributionExerciseANodeQuestion = EmotionAttributionExerciseANodeQuestion.new(current_node_data[SCENARIO_KEY], current_node_data[DOMANDA_KEY], current_node_data[RISPOSTE_CORRETTE_KEY], current_node_data[CORRECT_ANSWER_EXPLAINATION_KEY], current_node_data[SCENARIO_EXPLAINATION_KEY])
	questions_queue.append(node_question)
	
	var text_input_data: DialogueData = DialogueData.new(node_question.scenario, DialogueData.DialogueTypes.TEXT_WITH_QUESTION_INPUT, [], "", node_question.text)
	
	textbox.queue_dialogue([text_input_data])
	textbox.text_input_shown.connect(_start_question_timers, CONNECT_ONE_SHOT)
	textbox.text_submitted.connect(_on_text_submitted, CONNECT_ONE_SHOT)

func _on_text_submitted(submitted_text: String) -> void:
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
	var scenario_explaination_text_data: DialogueData = DialogueData.new(node_question.scenario_explaination, DialogueData.DialogueTypes.TEXT_ONLY)
	var correct_answer_explaination_text_data: DialogueData = DialogueData.new(node_question.correct_answer_explaination, DialogueData.DialogueTypes.TEXT_ONLY)
	
	textbox.queue_dialogue([scenario_explaination_text_data, correct_answer_explaination_text_data])
