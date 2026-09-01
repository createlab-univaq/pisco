'use client';

import { FauxPasExerciseAData } from "../types";
import { FauxPasExerciseACoreForm } from "./FauxPasExerciseACoreForm";


type Props = {
    data: FauxPasExerciseAData;
    onDataChange: (newData: FauxPasExerciseAData) => void;
    isDisabled?: boolean;
};

const FauxPasExerciseAEmbedded = ({ data, onDataChange, isDisabled }: Props) => {
    return (
        <FauxPasExerciseACoreForm
            data={data}
            onChange={onDataChange}
            isDisabled={isDisabled}
        />
    );
};

export default FauxPasExerciseAEmbedded;