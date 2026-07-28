extends RefCounted
class_name TheoryOfMindTranslator


static func translate(node: Dictionary) -> Dictionary:
	var translated_quizzes := []
	var quizzes: Array = node.get("data", {}).get("quiz", [])

	for quiz in quizzes:
		if not quiz is Dictionary:
			continue

		translated_quizzes.append({
			"narration": str(quiz.get("narration", "")),
			"questions": QuestionTranslationHelper.translate_all(
				quiz.get("questions", [])
			)
		})

	return {
		"type": "choice",
		"questions": translated_quizzes,
		"next": []
	}
