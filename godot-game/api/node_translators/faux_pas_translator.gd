class_name FauxPasTranslator
extends RefCounted

static func translate(node: Dictionary) -> Dictionary:
	var data := node.get("data", {}) as Dictionary
	var quizzes := data.get("quiz", []) as Array

	return {
		"type": "choice",
		"questions": quizzes.map(_translate_quiz_item),
		"next": node.get("next", [])
	}

static func _translate_quiz_item(quiz_item: Dictionary) -> Dictionary:
	var questions := quiz_item.get("questions", []) as Array
	
	return {
		"narration": str(quiz_item.get("narration", "")),
		"questions": questions.map(_translate_question)
	}

static func _translate_question(question: Dictionary) -> Dictionary:
	return SkipTranslationHelper.translate(question)
