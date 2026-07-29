class_name EyesTaskTranslator
extends RefCounted

static func translate(node: Dictionary) -> Dictionary:
	var data := node.get("data", {}) as Dictionary
	var source_questions := data.get("questions", []) as Array

	return {
		"type": "choice",
		"questions": source_questions.filter(
			func(q): return q is Dictionary 
		).map(_translate_question),
		"next": []
	}

static func _translate_question(question: Dictionary) -> Dictionary:
	return {
		"image": str(question.get("imageId", "")),
		"answers": AnswerTranslationHelper.translate(question.get("answers", []) as Array),
		"correctAnswers": [int(question.get("correctIndex", 0))]
	}
