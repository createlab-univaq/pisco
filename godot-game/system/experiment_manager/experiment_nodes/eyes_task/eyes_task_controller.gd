class_name EyesTaskController
extends BaseExperimentTask

const QUESTIONS_KEY: String = "questions"
const IMAGE_ID_KEY: String = "imageId"
const ANSWERS_KEY: String = "answers"
const CORRECT_INDEX_KEY: String = "correctIndex"

var questions_queue: Array[EyesTaskNodeQuestion] = []

func _execute_task() -> void:
	var questions: Array = current_node_data[QUESTIONS_KEY]
	max_score = questions.size()
	questions_queue.clear()
	
	for question in questions:
		var node_question: EyesTaskNodeQuestion = EyesTaskNodeQuestion.new(question[IMAGE_ID_KEY], question[ANSWERS_KEY], question[CORRECT_INDEX_KEY])
		questions_queue.append(node_question)
	
	textbox.choice_made.connect(_on_choice_made)
	_next_question()

func _next_question() -> void:
	if questions_queue.is_empty():
		textbox.choice_made.disconnect(_on_choice_made)
		finish_task() # Tells the manager we are done!
		return
		
	var current_question: EyesTaskNodeQuestion = questions_queue.front()
	var image_url = "%s/images/%s" % [APIManager.API_URL, current_question.image_id]
	var choice_data = DialogueData.new("", DialogueData.DialogueTypes.IMAGES, current_question.choices, image_url)
	
	textbox.queue_dialogue([choice_data])
	textbox.choices_shown.connect(_start_question_timers, CONNECT_ONE_SHOT)

func _on_choice_made(outcome: String) -> void:
	var current_question: EyesTaskNodeQuestion = questions_queue.pop_front()
	var is_user_answer_correct: bool = outcome == current_question.choices[current_question.correct_choice_index]
	
	_record_answer(outcome, is_user_answer_correct)
	_next_question()
