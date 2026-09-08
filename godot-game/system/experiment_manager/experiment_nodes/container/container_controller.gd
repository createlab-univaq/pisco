class_name ContainerController
extends BaseExperimentTask

enum NodeType {
	EMOTION_ATTRIBUTION_EXERCISE_A_NODE,
	EMOTION_ATTRIBUTION_EXERCISE_B_NODE,
	FAUX_PAS_EXERCISE_A_NODE,
	SOCIAL_SITUATIONS_EXERCISE_A_NODE,
	EMOTION_RECOGNITION_EXERCISE_A_CONTROLLER,
	THEORY_OF_MIND_EXERCISE_A_NODE
}

@onready var children_exercise_controller: Node = $ChildrenExerciseController

const NODE_TYPE_MAP: Dictionary[NodeType, String] = {
	NodeType.EMOTION_ATTRIBUTION_EXERCISE_A_NODE: "EmotionAttributionExerciseANode",
	NodeType.EMOTION_ATTRIBUTION_EXERCISE_B_NODE: "EmotionAttributionExerciseBNode",
	NodeType.FAUX_PAS_EXERCISE_A_NODE: "FauxPasExerciseANode",
	NodeType.SOCIAL_SITUATIONS_EXERCISE_A_NODE: "SocialSituationsExerciseANode",
	NodeType.EMOTION_RECOGNITION_EXERCISE_A_CONTROLLER: "EmotionRecognitionExerciseANode",
	NodeType.THEORY_OF_MIND_EXERCISE_A_NODE: "TheoryOfMindExerciseANode"
}

@onready var exercise_controllers: Dictionary[String, Resource] = {
	NODE_TYPE_MAP[NodeType.EMOTION_ATTRIBUTION_EXERCISE_A_NODE]: preload("uid://c7jgxsocafeno"),
	NODE_TYPE_MAP[NodeType.EMOTION_ATTRIBUTION_EXERCISE_B_NODE]: preload("uid://bsw16nfb1p87m"),
	NODE_TYPE_MAP[NodeType.FAUX_PAS_EXERCISE_A_NODE]: preload("uid://dcgmiuv1gyf7j"),
	NODE_TYPE_MAP[NodeType.SOCIAL_SITUATIONS_EXERCISE_A_NODE]: preload("uid://dou3w53uiy55t"),
	NODE_TYPE_MAP[NodeType.EMOTION_RECOGNITION_EXERCISE_A_CONTROLLER]: preload("uid://cc0a80ynj5blr"),
	NODE_TYPE_MAP[NodeType.THEORY_OF_MIND_EXERCISE_A_NODE]: preload("uid://kwr4f1ttrc0g")
}

const SECTIONS_KEY: String = "sections"
const ITEMS_KEY: String = "items"
const TYPE_KEY: String = "type"

var exercise_node_queue: Array[Dictionary] = []

func _execute_task() -> void:
	var sections: Array = current_node_data[SECTIONS_KEY]
	_reset()
	
	for section: Dictionary in sections:
		for item: Dictionary in section[ITEMS_KEY]:
			exercise_node_queue.append(item)
	
	_next_question()

func _reset() -> void:
	exercise_node_queue.clear()
	
	for child in children_exercise_controller.get_children():
		children_exercise_controller.remove_child(child)
		child.queue_free()

func _next_question() -> void:
	if exercise_node_queue.is_empty():
		finish_task() # Tells the manager we are done!
		return
	
	var current_exercise_node: Dictionary = exercise_node_queue.pop_front()
	var current_exercise_type: String = current_exercise_node[TYPE_KEY]
	
	var exercise_scene: Resource = exercise_controllers.get(current_exercise_type)
	assert(exercise_scene != null, "No controller found for exercise node type: %s" % [current_exercise_type])
	
	var exercise_controller: BaseExperimentTask = exercise_scene.instantiate()
	children_exercise_controller.add_child(exercise_controller)
	
	exercise_controller.initialize(dialogue_controller, stopwatch, mouse_tracker, first_input_interceptor)
	
	# Connect to its completion signal and start it
	exercise_controller.task_completed.connect(_on_task_completed.bind(exercise_controller), CONNECT_ONE_SHOT)
	exercise_controller.start_task(current_exercise_node)

func _on_task_completed(answers: Array[AnswerRecord], child_max_score: int, exercise_controller: BaseExperimentTask) -> void:
	answers_record.append_array(answers)
	max_score += child_max_score
	
	children_exercise_controller.remove_child(exercise_controller)
	exercise_controller.queue_free()
	
	_next_question()
