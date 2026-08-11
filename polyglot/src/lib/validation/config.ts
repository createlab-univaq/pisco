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

// Legacy checks for specific types (if you wish to keep them)
export const typeSpecificChecks: Record<string, (data: any) => boolean> = {
    WatchVideoNode: (data) =>
        typeof data?.link === 'string' && data.link.trim() !== '', 
};