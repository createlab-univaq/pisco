extends RefCounted
class_name QuestionTranslationHelper


static func translate(question: Dictionary) -> Dictionary:
	return {
		"question": question.get("question", ""),
		"answers": AnswerTranslationHelper.translate(
			question.get("answers", [])
		),
		"correctAnswers": [
			int(question.get("correctIndex", 0))
		]
	}


static func translate_all(questions: Array) -> Array:
	var translated_questions: Array = []

	for question in questions:
		translated_questions.append(
			translate(question)
		)

	return translated_questions
