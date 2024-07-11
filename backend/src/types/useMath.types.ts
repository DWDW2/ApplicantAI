type mathTestType = {
    id: string;
    question: string;
    questionType: string;
    explanation: string;
    options: string[];
    correct_option: string;
    svg_file: string | null;
}

type mathTestModelType = {
    test: mathTestType[];
    answers: object;
    createdAt: string;
    updatedAt: string;
}

export type {
    mathTestType,
    mathTestModelType
}

//