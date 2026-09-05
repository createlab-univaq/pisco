class_name ExperimentManager
extends Node

signal experiment_completed

@onready var stopwatch: Stopwatch = $Stopwatch
@onready var mouse_distance_tracker: MouseDistanceTracker = $MouseDistanceTracker
@onready var first_input_interceptor: FirstInputInterceptor = $FirstInputInterceptor

enum Operator {
	GREATER_EQUAL,
	GREATER,
	LOWER_EQUAL,
	LOWER,
	EQUAL,
	NOT_EQUAL
}

enum NodeType {
	TRUE_FALSE_NODE,
	EMOTION_ATTRIBUTION_NODE,
	EYES_TASK_NODE,
	FAUX_PAS_NODE
}

enum EdgeType {
	CONDITIONAL_EDGE,
	UNCONDITIONAL_EDGE
}

const OPERATOR_MAP: Dictionary[Operator, String] = {
	Operator.GREATER_EQUAL: ">=",
	Operator.GREATER: ">",
	Operator.LOWER_EQUAL: "<=",
	Operator.LOWER: "<",
	Operator.EQUAL: "==",
	Operator.NOT_EQUAL: "!="
}

const NODE_TYPE_MAP: Dictionary[NodeType, String] = {
	NodeType.TRUE_FALSE_NODE: "TrueFalseNode",
	NodeType.EMOTION_ATTRIBUTION_NODE: "EmotionAttributionNode",
	NodeType.EYES_TASK_NODE: "EyesTaskNode",
	NodeType.FAUX_PAS_NODE: "FauxPasNode"
}

const EDGE_TYPE_MAP: Dictionary[EdgeType, String] = {
	EdgeType.CONDITIONAL_EDGE: "ConditionalEdge",
	EdgeType.UNCONDITIONAL_EDGE: "UnconditionalEdge"
}

@export var actionable: Actionable
@export var textbox: TextBox

const ID_KEY: String = "_id"
const TITLE_KEY: String = "title"
const TYPE_KEY: String = "type"
const IS_EXERCISE_KEY: String = "isExercise"
const NODES_KEY: String = "nodes"
const DATA_KEY: String = "data"
const OPERATOR_KEY: String = "operator"
const THRESHOLD_KEY: String = "threshold"
const INSTRUCTIONS_KEY: String = "instructions"
const NARRATION_KEY: String = "narration"
const SINGLE_QUESTION_KEY: String = "question"
const QUESTIONS_KEY: String = "questions"
const IS_QUESTION_CORRECT_KEY: String = "isQuestionCorrect"
const CORRECT_ANSWERS_KEY: String = "correctAnswers"
const EDGES_KEY: String = "edges"
const REACT_FLOW_KEY: String = "reactFlow"
const SOURCE_KEY: String = "source"
const TARGET_KEY: String = "target"
const IMAGE_ID_KEY: String = "imageId"
const ANSWERS_KEY: String = "answers"
const CORRECT_INDEX_KEY: String = "correctIndex"
const QUIZ_KEY: String = "quiz"
const SKIP_IF_KEY: String = "skipIf"
const ENABLED_KEY: String = "enabled"
const ANSWER_INDEX: String = "answerIndex"
const QUESTION_INDEX: String = "questionIndex"

# Node Choices Keys
const TRUE_CHOICE_KEY: String = "Vero"
const FALSE_CHOICE_KEY: String = "False"

var current_node_id: String = ""
# Key: node_id, Value: node_definition
var nodes: Dictionary[String, Dictionary] = {}
# Key: source_node_id, Value: edges_with_origin_in_this_node_definitions
var edges: Dictionary[String, Array] = {}
var experiment_questions_queue: Array[ExperimentQuestion] = []

# Key: node_id, Value: node_record
var experiment_records: Dictionary[String, NodeRecord] = {}

func _ready():
	assert(actionable, "No actionable specified")
	assert(textbox, "No TextBox specified")
	
	actionable.actioned.connect(_on_actionable_actioned)
	first_input_interceptor.first_input_detected.connect(_on_first_input_detected)
	
	_prepare_experiment()

func _prepare_experiment() -> void:
	var redeemed_flow: Dictionary = APIManager.redeemed_flow
	
	if not redeemed_flow:
		return
	
	var redeemed_flow_nodes: Array = redeemed_flow[NODES_KEY]
	current_node_id = redeemed_flow_nodes.front()
	
	for node: Dictionary in redeemed_flow_nodes:
		nodes[node[ID_KEY]] = node
	
	for edge: Dictionary in redeemed_flow[EDGES_KEY]:
		var source_id: String = edge[REACT_FLOW_KEY][SOURCE_KEY]
		if not edges.has(source_id):
			edges[source_id] = []
		edges[source_id].append(edge)

func _start_node() -> void:
	var current_node: Dictionary = nodes[current_node_id]
	var current_node_type: String = current_node[TYPE_KEY]
	
	# Add node record
	var current_node_record: NodeRecord = NodeRecord.new(current_node_id, current_node[TITLE_KEY], current_node_type, current_node[IS_EXERCISE_KEY])
	experiment_records[current_node_id] = current_node_record
	
	match current_node_type:
		NODE_TYPE_MAP[NodeType.TRUE_FALSE_NODE]:
			_handle_true_false_node(current_node)
		NODE_TYPE_MAP[NodeType.EMOTION_ATTRIBUTION_NODE]:
			_handle_emotion_attribution_node(current_node)
		NODE_TYPE_MAP[NodeType.EYES_TASK_NODE]:
			_handle_eyes_task_node(current_node)
		NODE_TYPE_MAP[NodeType.FAUX_PAS_NODE]:
			_handle_faux_pas_node(current_node)

func _record_answer(user_answer: Variant, is_answer_correct: bool) -> void:
	
	# update node record score
	var current_node_record: NodeRecord = experiment_records[current_node_id]
	if is_answer_correct:
		current_node_record.score += 1
	
	# update answer
	var answer_record: AnswerRecord = current_node_record.answers.back()
	answer_record.user_answer = user_answer
	answer_record.correct = is_answer_correct
	
	# Stop mouse tracking
	mouse_distance_tracker.stop_tracking()
	answer_record.mouse_distance_in_centimeters = mouse_distance_tracker.total_distance_cm
	mouse_distance_tracker.reset_tracking()

func _record_node() -> void:
	var current_node_record: NodeRecord = experiment_records[current_node_id]
	
	# compute percentage score
	if current_node_record.max_score > 0:
		# maxScore : 100 = score : x
		current_node_record.percentage_score = (100.0 * current_node_record.score) / current_node_record.max_score
	else:
		current_node_record.percentage_score = 0.0
	
	var total_reaction_time_in_milliseconds: float = 0.0
	var total_response_time_in_milliseconds: float = 0.0
	var total_mouse_distance_in_centimeters: float = 0.0
	var node_answers: Array = current_node_record.answers
	for current_answer_record: AnswerRecord in node_answers:
		total_reaction_time_in_milliseconds += current_answer_record.reaction_time_in_milliseconds
		total_response_time_in_milliseconds += current_answer_record.response_time_in_milliseconds
		total_mouse_distance_in_centimeters += current_answer_record.mouse_distance_in_centimeters
	
	var number_of_answers: int = node_answers.size()
	if number_of_answers > 0:
		current_node_record.average_reaction_time_in_milliseconds = total_reaction_time_in_milliseconds / number_of_answers
		current_node_record.average_response_time_in_milliseconds = total_response_time_in_milliseconds / number_of_answers
		current_node_record.average_mouse_distance_in_centimeters = total_mouse_distance_in_centimeters / number_of_answers

func _end_node() -> void:
	if not edges.has(current_node_id):
		# experiment ended
		GameStateService.experiment_completed()
		experiment_completed.emit()
		return
	
	_record_node()
	
	# get edges from current node
	var source_node_edges: Array[Dictionary] = edges[current_node_id]
	
	var edge_index: int = 0
	var next_node_found: bool = false
	while edge_index < source_node_edges.size() and not next_node_found:
		var current_edge: Dictionary = source_node_edges[edge_index]
		
		match current_edge[TYPE_KEY]:
			EDGE_TYPE_MAP[EdgeType.UNCONDITIONAL_EDGE]:
				next_node_found = true
			EDGE_TYPE_MAP[EdgeType.CONDITIONAL_EDGE]:
				# get node record
				var current_node_record: NodeRecord = experiment_records[current_node_id]
				var edge_data: Dictionary = current_edge[DATA_KEY]
				next_node_found = _check_threshold(edge_data[OPERATOR_KEY], edge_data[THRESHOLD_KEY], current_node_record.score)
		
		if next_node_found:
			current_node_id = current_edge[REACT_FLOW_KEY][TARGET_KEY]
		
		edge_index += 1
	
	assert(next_node_found, "No next node found")

func _check_threshold(operator_key: String, threshold: float, value: float) -> bool:
	match operator_key:
		OPERATOR_MAP[Operator.GREATER_EQUAL]:
			return value >= threshold
		OPERATOR_MAP[Operator.GREATER]:
			return value > threshold
		OPERATOR_MAP[Operator.LOWER_EQUAL]:
			return value <= threshold
		OPERATOR_MAP[Operator.LOWER]:
			return value < threshold
		OPERATOR_MAP[Operator.EQUAL]:
			return value == threshold
		OPERATOR_MAP[Operator.NOT_EQUAL]:
			return value != threshold
	return false

######### TRUE FALSE NODE LOGIC #########

func _handle_true_false_node(true_false_node: Dictionary) -> void:
	
	var node_data: Dictionary = true_false_node[DATA_KEY]
	
	var questions: Array = node_data[QUESTIONS_KEY]
	# update node record max score
	var current_node_record: NodeRecord = experiment_records[current_node_id]
	current_node_record.max_score = questions.size()
	
	var correct_questions: Array = node_data[IS_QUESTION_CORRECT_KEY]
	
	assert(questions.size() == correct_questions.size(), "Questions and answers do not match")
	
	for index: int in range(questions.size()):
		var true_false_node_question: TrueFalseNodeQuestion = TrueFalseNodeQuestion.new(questions[index], correct_questions[index])
		experiment_questions_queue.append(true_false_node_question)
	
	var instructions_dialogue: DialogueData = DialogueData.new(node_data[INSTRUCTIONS_KEY], DialogueData.DialogueTypes.TEXT_ONLY)
	textbox.queue_dialogue([instructions_dialogue])
	textbox.dialogue_completed.connect(_on_true_false_node_instruction_dialogue_completed)

func _next_true_false_question() -> void:
	if experiment_questions_queue.is_empty():
		textbox.choice_made.disconnect(_on_true_false_node_choice_made)
		_end_node()
		return
	
	var current_node_record: NodeRecord = experiment_records[current_node_id]
	# create empty answer record
	current_node_record.answers.append(AnswerRecord.new())
	
	var true_false_node_question: TrueFalseNodeQuestion = experiment_questions_queue.front()
	var true_false_choice: DialogueData = DialogueData.new(true_false_node_question.text, DialogueData.DialogueTypes.CHOICES, [TRUE_CHOICE_KEY, FALSE_CHOICE_KEY])
	textbox.queue_dialogue([true_false_choice])
	textbox.choices_shown.connect(_on_true_false_node_choice_shown, CONNECT_ONE_SHOT)

func _on_true_false_node_instruction_dialogue_completed() -> void:
	textbox.dialogue_completed.disconnect(_on_true_false_node_instruction_dialogue_completed)
	_next_true_false_question()
	textbox.choice_made.connect(_on_true_false_node_choice_made)

func _on_true_false_node_choice_shown() -> void:
	_on_response_shown_to_user()

func _on_true_false_node_choice_made(outcome: String) -> void:
	_on_user_response_submission()
	
	var true_false_node_question: TrueFalseNodeQuestion = experiment_questions_queue.pop_front()
	var is_has_user_selected_true: bool = outcome == TRUE_CHOICE_KEY
	var is_user_answer_correct: bool = is_has_user_selected_true == true_false_node_question.is_true
	
	_record_answer(outcome, is_user_answer_correct)
	
	_next_true_false_question()

######### TRUE FALSE NODE LOGIC #########

######### EMOTION ATTRIBUTION NODE LOGIC #########

func _handle_emotion_attribution_node(emotion_attribution_node: Dictionary) -> void:
	
	var node_data: Dictionary = emotion_attribution_node[DATA_KEY]
	
	var questions: Array = node_data[QUESTIONS_KEY]
	# update node record max score
	var current_node_record: NodeRecord = experiment_records[current_node_id]
	current_node_record.max_score = questions.size()
	
	for question: Dictionary in questions:
		var emotion_attribution_node_question: EmotionAttributionNodeQuestion = EmotionAttributionNodeQuestion.new(question[NARRATION_KEY], question[SINGLE_QUESTION_KEY], question[CORRECT_ANSWERS_KEY])
		experiment_questions_queue.append(emotion_attribution_node_question)
	
	textbox.text_submitted.connect(_on_emotion_attribution_node_text_submitted)
	_next_emotion_attribution_question()

func _next_emotion_attribution_question() -> void:
	if experiment_questions_queue.is_empty():
		textbox.text_submitted.disconnect(_on_emotion_attribution_node_text_submitted)
		_end_node()
		return
	
	var current_node_record: NodeRecord = experiment_records[current_node_id]
	# create empty answer record
	current_node_record.answers.append(AnswerRecord.new())
	
	var emotion_attribution_node_question: EmotionAttributionNodeQuestion = experiment_questions_queue.front()
	var emotion_attribution_text_input: DialogueData = DialogueData.new(emotion_attribution_node_question.narration, DialogueData.DialogueTypes.TEXT_WITH_QUESTION_INPUT, [], "", emotion_attribution_node_question.question)
	textbox.queue_dialogue([emotion_attribution_text_input])
	textbox.text_input_shown.connect(_on_emotion_attribution_node_text_input_shown, CONNECT_ONE_SHOT)

func _on_emotion_attribution_node_text_input_shown() -> void:
	_on_response_shown_to_user()

func _on_emotion_attribution_node_text_submitted(submitted_text: String) -> void:
	_on_user_response_submission()
	
	var emotion_attribution_node_question: EmotionAttributionNodeQuestion = experiment_questions_queue.pop_front()
	var is_user_answer_correct: bool = false
	var correct_answer_index: int = 0
	var correct_answers: Array[String] = emotion_attribution_node_question.correct_answers
	while not is_user_answer_correct and correct_answer_index < correct_answers.size():
		var current_correct_answer: String = correct_answers[correct_answer_index].to_lower()
		is_user_answer_correct = current_correct_answer == submitted_text.to_lower()
		correct_answer_index += 1
	
	_record_answer(submitted_text, is_user_answer_correct)
	
	_next_emotion_attribution_question()

######### EMOTION ATTRIBUTION NODE LOGIC #########

######### EYESTASK NODE LOGIC #########

func _handle_eyes_task_node(eyes_task_node: Dictionary) -> void:
	
	var node_data: Dictionary = eyes_task_node[DATA_KEY]
	
	var questions: Array = node_data[QUESTIONS_KEY]
	# update node record max score
	var current_node_record: NodeRecord = experiment_records[current_node_id]
	current_node_record.max_score = questions.size()
	
	for question in questions:
		var eyes_task_node_question: EyesTaskNodeQuestion = EyesTaskNodeQuestion.new(question[IMAGE_ID_KEY], question[ANSWERS_KEY], question[CORRECT_INDEX_KEY])
		experiment_questions_queue.append(eyes_task_node_question)
	
	textbox.choice_made.connect(_on_eyes_task_node_choice_made)
	_next_eyes_task_question()

func _next_eyes_task_question() -> void:
	if experiment_questions_queue.is_empty():
		textbox.choice_made.disconnect(_on_eyes_task_node_choice_made)
		_end_node()
		return
	
	var current_node_record: NodeRecord = experiment_records[current_node_id]
	# create empty answer record
	current_node_record.answers.append(AnswerRecord.new())
	
	var eyes_task_node_question: EyesTaskNodeQuestion = experiment_questions_queue.front()
	var image_url: String = APIManager.API_URL + APIManager.IMAGES_PATH + "/" + eyes_task_node_question.image_id
	var eyes_task_choice: DialogueData = DialogueData.new("", DialogueData.DialogueTypes.IMAGES, eyes_task_node_question.choices, image_url)
	textbox.queue_dialogue([eyes_task_choice])
	textbox.choices_shown.connect(_on_eyes_task_node_choice_shown, CONNECT_ONE_SHOT)

func _on_eyes_task_node_choice_shown() -> void:
	_on_response_shown_to_user()

func _on_eyes_task_node_choice_made(outcome: String) -> void:
	_on_user_response_submission()
	
	var eyes_task_node_question: EyesTaskNodeQuestion = experiment_questions_queue.pop_front()
	var is_user_answer_correct: bool = outcome == eyes_task_node_question.choices[eyes_task_node_question.correct_choice_index]
	
	_record_answer(outcome, is_user_answer_correct)
	
	_next_eyes_task_question()

######### EYESTASK NODE LOGIC #########

######### FAUX PAS NODE LOGIC #########

func _handle_faux_pas_node(faux_pas_node: Dictionary) -> void:
	
	var node_data: Dictionary = faux_pas_node[DATA_KEY]
	
	var quiz_questions: Array = node_data[QUIZ_KEY]
	# update node record max score
	var current_node_record: NodeRecord = experiment_records[current_node_id]
	current_node_record.max_score = quiz_questions.size()
	
	for question: Dictionary in quiz_questions:
		var quiz_single_questions: Array = question[QUESTIONS_KEY]
		var quiz_single_question_index: int = 0
		while quiz_single_question_index < quiz_single_questions.size() :
			var single_question: Dictionary = quiz_single_questions[quiz_single_question_index]
			var faux_pas_skip_question: FauxPasSkipQuestion = null
			var skip_if: Dictionary = single_question[SKIP_IF_KEY]
			if skip_if[ENABLED_KEY]:
				var skip_if_question_index: int = skip_if[QUESTION_INDEX]
				var skip_if_question: Dictionary = quiz_single_questions[skip_if_question_index]
				var skip_if_question_answer: String = skip_if_question[ANSWERS_KEY][skip_if[ANSWER_INDEX]]
				faux_pas_skip_question = FauxPasSkipQuestion.new(skip_if_question_index, skip_if_question_answer)
			var faux_pas_node_question: FauxPasNodeQuestion = FauxPasNodeQuestion.new(single_question[SINGLE_QUESTION_KEY], quiz_single_question_index == 0, question[NARRATION_KEY], single_question[CORRECT_INDEX_KEY], single_question[ANSWERS_KEY], faux_pas_skip_question)
			experiment_questions_queue.append(faux_pas_node_question)
			quiz_single_question_index += 1
	
	textbox.choice_made.connect(_on_faux_pas_node_choice_made)
	_next_faux_pas_question()

func _next_faux_pas_question() -> void:
	if experiment_questions_queue.is_empty():
		_on_faux_pas_questions_finished()
		return
	
	var current_node_record: NodeRecord = experiment_records[current_node_id]
	var current_node_answers: Array[AnswerRecord] = current_node_record.answers
	# create empty answer record
	current_node_answers.append(AnswerRecord.new())
	
	var faux_pas_node_question: FauxPasNodeQuestion = experiment_questions_queue.front()
	var faux_pas_node_skip_question: FauxPasSkipQuestion = faux_pas_node_question.skip_question
	var is_skip_question: bool = true
	while is_skip_question and not experiment_questions_queue.is_empty():
		is_skip_question = current_node_answers[faux_pas_node_skip_question.answer_index].user_answer == faux_pas_node_skip_question.question_answer
		if is_skip_question:
			# skip current answer
			experiment_questions_queue.pop_front()
			faux_pas_node_question = experiment_questions_queue.front()
			faux_pas_node_skip_question = faux_pas_node_question.skip_question
	
	if experiment_questions_queue.is_empty():
		_on_faux_pas_questions_finished()
		return
	
	if faux_pas_node_question.is_first:
		var faux_pas_text: DialogueData = DialogueData.new(faux_pas_node_question.narration, DialogueData.DialogueTypes.TEXT_ONLY)
		textbox.dialogue_completed.connect(_show_faux_pas_question, CONNECT_ONE_SHOT)
	else:
		_show_faux_pas_question()

func _on_faux_pas_questions_finished() -> void:
	textbox.choice_made.disconnect(_on_faux_pas_node_choice_made)
	_end_node()

func _show_faux_pas_question() -> void:
	var faux_pas_node_question: FauxPasNodeQuestion = experiment_questions_queue.front()
	var faux_pas_choice: DialogueData = DialogueData.new(faux_pas_node_question.narration, DialogueData.DialogueTypes.FIXED_TEXT_WITH_QUESTION_CHOICE, faux_pas_node_question.choices, "", faux_pas_node_question.question)
	textbox.queue_dialogue([faux_pas_choice])
	textbox.choices_shown.connect(_on_faux_pas_node_choice_shown, CONNECT_ONE_SHOT)

func _on_faux_pas_node_choice_shown() -> void:
	_on_response_shown_to_user()

func _on_faux_pas_node_choice_made(outcome: String) -> void:
	_on_user_response_submission()
	
	var faux_pas_node_question: FauxPasNodeQuestion = experiment_questions_queue.pop_front()
	var is_user_answer_correct: bool = outcome == faux_pas_node_question.choices[faux_pas_node_question.correct_question_index]
	
	_record_answer(outcome, is_user_answer_correct)
	
	_next_faux_pas_question()

######### FAUX PAS NODE LOGIC #########

func _on_actionable_actioned(_tile: Actionable, _player: Player) -> void:
	_start_node()

func _on_response_shown_to_user() -> void:
	# Start mouse tracking
	mouse_distance_tracker.start_tracking()
	
	# Start reaction time stopwatch
	stopwatch.start()
	
	# Start listening for first event
	first_input_interceptor.start_listening()

func _on_user_response_submission() -> void:
	# Stop response time stopwatch
	stopwatch.stop()
	
	var current_node_record: NodeRecord = experiment_records[current_node_id]
	var answer_record: AnswerRecord = current_node_record.answers.back()
	answer_record.response_time_in_milliseconds = stopwatch.time_elapsed
	
	stopwatch.reset()

func _on_first_input_detected() -> void:
	# Stop reaction time stopwatch
	stopwatch.stop()
	
	var current_node_record: NodeRecord = experiment_records[current_node_id]
	var answer_record: AnswerRecord = current_node_record.answers.back()
	answer_record.reaction_time_in_milliseconds = stopwatch.time_elapsed
	
	# Start response time stopwatch
	stopwatch.reset_and_restart()
