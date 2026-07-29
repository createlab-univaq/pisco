class_name TheoryOfMindTranslator
extends RefCounted

static func translate(node: Dictionary) -> Dictionary:
	var translated_quizzes := []
	var data := node.get("data", {}) as Dictionary
	var quizzes := data.get("quiz", []) as Array

	for quiz in quizzes:
		var quiz_dict := quiz as Dictionary
		if quiz_dict == null:
			continue

		translated_quizzes.append({
			"narration": str(quiz_dict.get("narration", "")),
			"questions": QuestionTranslationHelper.translate_all(quiz_dict.get("questions", []) as Array)
		})

	return {
		"type": "choice",
		"questions": translated_quizzes,
		"next": []
	}
