class_name QuestionTranslationHelper
extends RefCounted

static func translate(question: Dictionary) -> Dictionary:
	return {
		"question": str(question.get("question", "")),
		"answers": AnswerTranslationHelper.translate(question.get("answers", []) as Array),
		"correctAnswers": [int(question.get("correctIndex", 0))]
	}

static func translate_all(questions: Array) -> Array:
	return questions.map(translate)
