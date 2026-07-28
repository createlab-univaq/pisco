extends RefCounted
class_name EdgeTranslator


static func translate_all(
	edges: Array,
	node_indexes: Dictionary
) -> Array:
	var translated_edges: Array = []

	for edge in edges:
		if not edge is Dictionary:
			continue

		var translated_edge: Dictionary = translate(
			edge,
			node_indexes
		)

		if not translated_edge.is_empty():
			translated_edges.append(translated_edge)

	return translated_edges


static func translate(
	edge: Dictionary,
	node_indexes: Dictionary
) -> Dictionary:
	var edge_type: String = str(edge.get("type", ""))

	match edge_type:
		"conditionalEdge":
			return ConditionalEdgeTranslator.translate(
				edge,
				node_indexes
			)

		_:
			push_warning(
				"Tipo di edge non supportato: %s" % edge_type
			)
			return {}
