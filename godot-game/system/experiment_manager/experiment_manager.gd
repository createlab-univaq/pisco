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
	FAUX_PAS_NODE,
	SOCIAL_SITUATIONS_NODE,
	THEORY_OF_MIND_NODE,
	EMOTION_ATTRIBUTION_EXERCISE_A_NODE,
	EMOTION_ATTRIBUTION_EXERCISE_B_NODE,
	FAUX_PAS_EXERCISE_A_NODE,
	THEORY_OF_MIND_EXERCISE_A_NODE,
	EMOTION_RECOGNITION_EXERCISE_A_CONTROLLER,
	SOCIAL_SITUATIONS_EXERCISE_A_NODE,
	CONTAINER_NODE
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
	NodeType.FAUX_PAS_NODE: "FauxPasNode",
	NodeType.SOCIAL_SITUATIONS_NODE: "SocialSituationsNode",
	NodeType.THEORY_OF_MIND_NODE: "TheoryOfMindNode",
	NodeType.EMOTION_ATTRIBUTION_EXERCISE_A_NODE: "EmotionAttributionExerciseANode",
	NodeType.EMOTION_ATTRIBUTION_EXERCISE_B_NODE: "EmotionAttributionExerciseBNode",
	NodeType.FAUX_PAS_EXERCISE_A_NODE: "FauxPasExerciseANode",
	NodeType.THEORY_OF_MIND_EXERCISE_A_NODE: "TheoryOfMindExerciseANode",
	NodeType.EMOTION_RECOGNITION_EXERCISE_A_CONTROLLER: "EmotionRecognitionExerciseANode",
	NodeType.SOCIAL_SITUATIONS_EXERCISE_A_NODE: "SocialSituationsExerciseANode",
	NodeType.CONTAINER_NODE: "ContainerNode"
}

const EDGE_TYPE_MAP: Dictionary[EdgeType, String] = {
	EdgeType.CONDITIONAL_EDGE: "ConditionalEdge",
	EdgeType.UNCONDITIONAL_EDGE: "UnconditionalEdge"
}

@onready var task_handlers: Dictionary = {
	NODE_TYPE_MAP[NodeType.TRUE_FALSE_NODE]: $TaskControllers/TrueFalseController,
	NODE_TYPE_MAP[NodeType.EMOTION_ATTRIBUTION_NODE]: $TaskControllers/EmotionAttributionController,
	NODE_TYPE_MAP[NodeType.EYES_TASK_NODE]: $TaskControllers/EyesTaskController,
	NODE_TYPE_MAP[NodeType.FAUX_PAS_NODE]: $TaskControllers/FauxPasController,
	NODE_TYPE_MAP[NodeType.SOCIAL_SITUATIONS_NODE]: $TaskControllers/SocialSituationsController,
	NODE_TYPE_MAP[NodeType.THEORY_OF_MIND_NODE]: $TaskControllers/TheoryOfMindController,
	NODE_TYPE_MAP[NodeType.EMOTION_ATTRIBUTION_EXERCISE_A_NODE]: $TaskControllers/EmotionAttributionExerciseAController,
	NODE_TYPE_MAP[NodeType.EMOTION_ATTRIBUTION_EXERCISE_B_NODE]: $TaskControllers/EmotionAttributionExerciseBController,
	NODE_TYPE_MAP[NodeType.FAUX_PAS_EXERCISE_A_NODE]: $TaskControllers/FauxPasExerciseAController,
	NODE_TYPE_MAP[NodeType.THEORY_OF_MIND_EXERCISE_A_NODE]: $TaskControllers/TheoryOfMindExerciseAController,
	NODE_TYPE_MAP[NodeType.EMOTION_RECOGNITION_EXERCISE_A_CONTROLLER]: $TaskControllers/EmotionRecognitionExerciseAController,
	NODE_TYPE_MAP[NodeType.SOCIAL_SITUATIONS_EXERCISE_A_NODE]: $TaskControllers/SocialSituationsExerciseAController,
	NODE_TYPE_MAP[NodeType.CONTAINER_NODE]: $TaskControllers/ContainerController
}

@export var actionable: Actionable
@export var dialogue_controller: DialogueController

const ID_KEY: String = "_id"
const TITLE_KEY: String = "title"
const TYPE_KEY: String = "type"
const IS_EXERCISE_KEY: String = "isExercise"
const NODES_KEY: String = "nodes"
const DATA_KEY: String = "data"
const OPERATOR_KEY: String = "operator"
const THRESHOLD_KEY: String = "threshold"
const EDGES_KEY: String = "edges"
const REACT_FLOW_KEY: String = "reactFlow"
const SOURCE_KEY: String = "source"
const TARGET_KEY: String = "target"

var is_experiment_running: bool = false

var current_node_id: String = ""
# Key: node_id, Value: node_definition
var nodes: Dictionary[String, Dictionary] = {}
# Key: source_node_id, Value: edges_with_origin_in_this_node_definitions
var edges: Dictionary[String, Array] = {}
# Key: node_id, Value: node_record
var experiment_records: Dictionary[String, NodeRecord] = {}

var started_at: String = ""
var finished_at: String = ""

func _ready():
	assert(actionable, "No actionable specified")
	assert(dialogue_controller, "No Dialogue Controller specified")
	
	for handler: BaseExperimentTask in task_handlers.values():
		handler.initialize(dialogue_controller, stopwatch, mouse_distance_tracker, first_input_interceptor)
	
	actionable.actioned.connect(_on_actionable_actioned)
	
	_prepare_experiment()

func _prepare_experiment() -> void:
	var redeemed_flow: Dictionary = APIManager.redeemed_flow.flow.flow_json
	
	if not redeemed_flow:
		return
	
	var redeemed_flow_nodes: Array = redeemed_flow[NODES_KEY]
	current_node_id = redeemed_flow_nodes.front()[ID_KEY]
	
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
	
	# Fetch the correct handler component dynamically!
	var handler: BaseExperimentTask = task_handlers.get(current_node_type)
	assert(handler != null, "No handler found for node type: %s" % [current_node_type])
	
	# Connect to its completion signal and start it
	handler.task_completed.connect(_on_task_completed, CONNECT_ONE_SHOT)
	handler.start_task(current_node)

func _on_task_completed(answers: Array[AnswerRecord], max_score: int) -> void:
	var current_record: NodeRecord = experiment_records[current_node_id]
	current_record.answers = answers
	current_record.max_score = max_score
	
	# Calculate score based on answers
	current_record.score = 0
	for ans in answers:
		if ans.correct: current_record.score += 1
		
	_end_node()

func _end_node() -> void:
	is_experiment_running = false
	
	if not edges.has(current_node_id):
		# experiment ended
		finished_at = Time.get_datetime_string_from_system(true, true)
		APIManager.record_game_execution(experiment_records.values(), APIManager.redeemed_flow, started_at, finished_at)
		GameStateService.experiment_completed()
		experiment_completed.emit()
		return
	
	_record_node()
	
	# get edges from current node
	var source_node_edges: Array = edges[current_node_id]
	
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
				var edge_data: Dictionary = current_edge[REACT_FLOW_KEY][DATA_KEY]
				next_node_found = _check_threshold(edge_data[OPERATOR_KEY], edge_data[THRESHOLD_KEY], current_node_record.score)
		
		if next_node_found:
			current_node_id = current_edge[REACT_FLOW_KEY][TARGET_KEY]
		
		edge_index += 1
	
	assert(next_node_found, "No next node found")

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

func _on_actionable_actioned(_tile: Actionable, _player: Player) -> void:
	if is_experiment_running:
		return # Block input spam!
	
	is_experiment_running = true
	
	if started_at.is_empty():
		started_at = Time.get_datetime_string_from_system(true, true)
	_start_node()
