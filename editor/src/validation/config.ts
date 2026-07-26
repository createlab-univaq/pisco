export const allowedEmptyFields = [
  'link',
  'isAnswerCorrect',
  'context',
  'mandatoryTopics',
  'textToFill',
  'material',
  'negativePoints',
  'positivePoints',
];

// check “legacy” per tipi specifici (se vuoi mantenerli)
export const typeSpecificChecks: Record<string, (data: any) => boolean> = {
  WatchVideoNode: (data) =>
    typeof data?.link === 'string' && data.link.trim() !== '',
};
