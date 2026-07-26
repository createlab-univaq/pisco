import { AddIcon, ArrowForwardIcon, CloseIcon } from '@chakra-ui/icons';
import { Button, Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useState } from 'react';
import {
  RegisterOptions,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';

type FieldConfig = {
  name: string; // es: "left" o "right"
  placeholder?: string; // testo nell'input
  constraints?: RegisterOptions;
};

const MultiFieldArray = ({
  label,
  name,
  fieldsConfig,
}: {
  label: string;
  name: string; // es: "pairs" o "translations"
  fieldsConfig: FieldConfig[];
}) => {
  const { register, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  // stato temporaneo per nuovi valori
  const [newValues, setNewValues] = useState<Record<string, string>>(
    Object.fromEntries(fieldsConfig.map((f) => [f.name, '']))
  );

  const handleChange = (field: string, value: string) => {
    setNewValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    if (Object.values(newValues).every((v) => !v)) return;
    append(newValues);
    setNewValues(Object.fromEntries(fieldsConfig.map((f) => [f.name, ''])));
  };

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>

      {fields.map((field, index) => (
        <Flex key={field.id} gap={2} mb={2}>
          {fieldsConfig.map((fc, i) => (
            <Flex key={fc.name} align="center" gap={2}>
              <Input
                key={fc.name}
                {...register(`${name}.${index}.${fc.name}`, fc.constraints)}
                placeholder={fc.placeholder ? fc.placeholder : fc.name}
                borderColor="grey"
              />
              {fieldsConfig.length === 2 && i === 0 && <ArrowForwardIcon />}
            </Flex>
          ))}
          <Button colorScheme="red" onClick={() => remove(index)}>
            <CloseIcon boxSize="0.75em" />
          </Button>
        </Flex>
      ))}

      <Flex gap={2} mt={2}>
        {fieldsConfig.map((fc, i) => (
          <Flex key={fc.name} align="center" gap={2}>
            <Input
              key={fc.name}
              value={newValues[fc.name]}
              onChange={(e) => handleChange(fc.name, e.target.value)}
              placeholder={fc.placeholder}
              borderColor="grey"
            />
            {fieldsConfig.length === 2 && i === 0 && <ArrowForwardIcon />}
          </Flex>
        ))}
        <Button colorScheme="green" onClick={handleAdd}>
          <AddIcon boxSize="0.75em" />
        </Button>
      </Flex>
    </FormControl>
  );
};

export default MultiFieldArray;
