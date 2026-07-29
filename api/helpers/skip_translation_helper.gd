class_name SkipTranslationHelper
extends RefCounted

static func translate(question: Dictionary) -> Dictionary:
	var translated_question := QuestionTranslationHelper.translate(question)
	
	var skip_if := question.get("skipIf", {}) as Dictionary

	if skip_if != null and skip_if.get("enabled", false):
		translated_question["skip"] = [{
			"question": int(skip_if.get("questionIndex", 0)),
			"answer": int(skip_if.get("answerIndex", 0))
		}]

	return translated_question

static func translate_all(questions: Array) -> Array:
	return questions.map(translate)
