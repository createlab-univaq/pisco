extends RefCounted
class_name CorrectAnswersTranslationHelper


static func translate(answers: Array) -> Array:
	var translated_answers: Array = []

	for answer in answers:
		translated_answers.append(str(answer))

	return translated_answers
