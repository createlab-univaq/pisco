class_name ConditionalEdgeTranslator
extends RefCounted

const OPERATORS: Dictionary = {
	">": "gt",
	">=": "ge",
	"<": "lt",
	"<=": "le",
	"==": "eq",
	"!=": "ne"
}

static func translate(edge: Dictionary, node_indexes: Dictionary) -> Dictionary:
	var target_id: String = str(edge.get("target", ""))

	if not node_indexes.has(target_id):
		push_warning("Edge target not found: %s" % target_id)
		return {}

	return {
		"node": int(node_indexes[target_id]),
		"operator": _translate_operator(str(edge.get("operator", ""))),
		"threshold": int(edge.get("threshold", 0))
	}

static func _translate_operator(operator: String) -> String:
	return str(OPERATORS.get(operator, operator))
