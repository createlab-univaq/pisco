'use client';

import { TheoryOfMindExerciseAData } from "../types";
import { TheoryOfMindExerciseACoreForm } from "./TheoryOfMindExerciseACoreForm";


type Props = {
    data: TheoryOfMindExerciseAData;
    onDataChange: (newData: TheoryOfMindExerciseAData) => void;
    parentNodeId?: string;
    isDisabled?: boolean;
};

const TheoryOfMindExerciseAEmbedded = ({ data, onDataChange, parentNodeId, isDisabled }: Props) => {
    return (
        <TheoryOfMindExerciseACoreForm
            data={data}
            onChange={onDataChange}
            nodeId={parentNodeId}
            isDisabled={isDisabled}
        />
    );
};

export default TheoryOfMindExerciseAEmbedded;