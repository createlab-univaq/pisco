class_name EmotionAttributionTranslator
extends RefCounted

static func translate(node: Dictionary) -> Dictionary:
	var data := node.get("data", {}) as Dictionary
	var source_questions := data.get("questions", []) as Array

	return {
		"type": "choice_input",
		"questions": source_questions.filter(func(q): return q is Dictionary).map(_translate_question),
		"next": []
	}

static func _translate_question(question: Dictionary) -> Dictionary:
	return {
		"narration": str(question.get("narration", "")),
		"question": str(question.get("question", "")),
		"correctAnswers": CorrectAnswersTranslationHelper.translate(question.get("correctAnswers", []) as Array)
	}
