import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import RemarkMathPlugin from 'remark-math';
import MdEditor from '../../Editor/MdEditor';

import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/react';
import 'katex/dist/katex.min.css';
import { useController, useFormContext } from 'react-hook-form';
import 'react-markdown-editor-lite/lib/index.css';

type MarkDownFieldProps = {
  label: string;
  name: string;
};

// TODO: html validation, possible xss attack
const MarkDownField = ({ label, name }: MarkDownFieldProps) => {
  const { control, getFieldState } = useFormContext();
  const { error } = getFieldState(name);

  const { field } = useController({
    name,
    control,
  });

  return (
    <Box
      p={2}
      border={'solid'}
      borderColor={'grey'}
      borderRadius={'8px'}
      borderWidth={'1px'}
    >
      <FormControl isInvalid={error !== undefined}>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <MdEditor
          style={{ height: '500px' }}
          renderHTML={(text) => (
            <ReactMarkdown
              remarkPlugins={[remarkGfm, RemarkMathPlugin]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
            >
              {text}
            </ReactMarkdown>
          )}
          {...field}
          onChange={(data) => {
            field.onChange({ target: { value: data.text } });
          }}
        />
        <FormErrorMessage>{error && error.message}</FormErrorMessage>
      </FormControl>
    </Box>
  );
};

export default MarkDownField;
