import {
  Badge,
  Box,
  Button,
  Flex,
  Image,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { API } from '../../../data/api';

type Props = {
  parentNodeId: string;
  parentItemId?: string; // nuovo (opzionale)
  imageId?: string; // valore attuale nel nodo
  imageIdName: string; // es: "data.questions.0.imageId"
  isDisabled?: boolean;
};

const QuestionImageUploadField = ({
  parentNodeId,
  parentItemId,
  imageId,
  imageIdName,
  isDisabled,
}: Props) => {
  const toast = useToast();
  const { setValue } = useFormContext();

  const [file, setFile] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [checking, setChecking] = useState(false);
  const [hasRemote, setHasRemote] = useState(false);

  const canUse = useMemo(() => !!parentNodeId, [parentNodeId]);

  // se esiste già una immagine (id nel form) o risulta presente lato server, blocca inserimento nuova
  const hasImageAlready = useMemo(
    () => !!imageId || hasRemote,
    [imageId, hasRemote]
  );

  // cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) window.URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // quando cambia imageId: aggiorna badge "presente/non presente"
  useEffect(() => {
    let cancelled = false;

    const checkRemote = async () => {
      if (!imageId) {
        setHasRemote(false);
        return;
      }
      setChecking(true);
      try {
        await API.downloadByFileId({ fileId: imageId });
        if (!cancelled) setHasRemote(true);
      } catch {
        if (!cancelled) setHasRemote(false);
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    // reset preview se cambia immagine
    setPreviewUrl((prev) => {
      if (prev) window.URL.revokeObjectURL(prev);
      return undefined;
    });

    // reset file selezionato quando cambia immagine
    setFile(undefined);

    checkRemote();
    return () => {
      cancelled = true;
    };
  }, [imageId]);

  const onUpload = async () => {
    if (isDisabled) return;

    // BLOCCO: non permettere una seconda immagine
    if (hasImageAlready) {
      toast({
        title: "C'è già un'immagine",
        description: 'Elimina prima quella esistente per caricarne un’altra.',
        status: 'info',
      });
      return;
    }

    if (!canUse) {
      toast({ title: 'ID nodo non valido', status: 'warning' });
      return;
    }
    if (!file) {
      toast({ title: "Seleziona un'immagine", status: 'warning' });
      return;
    }

    const ok =
      ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(
        file.type
      ) || /\.(png|jpg|jpeg|webp)$/i.test(file.name);

    if (!ok) {
      toast({
        title: 'Formato non supportato (PNG/JPG/WEBP)',
        status: 'warning',
      });
      return;
    }

    try {
      const resp = await API.uploadImageGeneric({
        parentNodeId,
        parentItemId, // ✅ nuovo
        file,
      });

      const newImageId = resp.data?.imageId;
      if (!newImageId) {
        toast({ title: 'Upload ok ma imageId mancante', status: 'error' });
        return;
      }

      // scrive imageId nel nodo (react-hook-form)
      setValue(imageIdName, newImageId, { shouldDirty: true });

      setHasRemote(true);
      setFile(undefined);

      toast({ title: 'Immagine caricata', status: 'success' });
    } catch (e: any) {
      const status = e?.response?.status ?? e?.status;
      const msg = e?.response?.data?.message ?? e?.message ?? 'Upload fallito';
      console.log('UPLOAD ERROR', { status, msg, e });
      toast({
        title: `Upload fallito${status ? ` (${status})` : ''}`,
        description: msg,
        status: 'error',
      });
    }
  };

  const onPreview = async () => {
    if (!imageId) return;

    try {
      const resp = await API.downloadByFileId({ fileId: imageId });

      const blob = new Blob([resp.data], {
        type: resp.headers?.['content-type'] || 'image/png',
      });

      const url = window.URL.createObjectURL(blob);

      setPreviewUrl((prev) => {
        if (prev) window.URL.revokeObjectURL(prev);
        return url;
      });
    } catch (e: any) {
      const status = e?.response?.status ?? e?.status;
      console.log('PREVIEW ERROR', { status, e });
      toast({
        title: 'Immagine non trovata o errore download',
        status: 'info',
      });
      setHasRemote(false);
    }
  };

  const onDelete = async () => {
    if (isDisabled) return;
    if (!imageId) return;

    try {
      await API.deleteByFileId({ fileId: imageId });
      // rimuove il riferimento dal nodo
      setValue(imageIdName, undefined, { shouldDirty: true });

      setHasRemote(false);
      setFile(undefined);

      setPreviewUrl((prev) => {
        if (prev) window.URL.revokeObjectURL(prev);
        return undefined;
      });

      toast({ title: 'Immagine eliminata', status: 'success' });
    } catch (e: any) {
      const status = e?.response?.status ?? e?.status;
      const msg = e?.response?.data?.message ?? e?.message ?? 'Delete fallito';
      console.log('DELETE ERROR', { status, msg, e });
      toast({
        title: `Eliminazione fallita${status ? ` (${status})` : ''}`,
        description: msg,
        status: 'error',
      });
    }
  };

  return (
    <Box mt={3}>
      <Flex align="center" justify="space-between" mb={2}>
        <Text fontSize="sm">Immagine (PNG/JPG/WEBP)</Text>
        <Badge colorScheme={hasRemote ? 'green' : 'gray'}>
          {checking
            ? 'Controllo...'
            : hasRemote
            ? 'Immagine presente'
            : 'Nessuna immagine'}
        </Badge>
      </Flex>

      <Input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => setFile(e.target.files?.[0])}
        isDisabled={isDisabled || !canUse || hasImageAlready}
      />

      <Flex gap={2} mt={2}>
        <Button
          size="sm"
          colorScheme="teal"
          onClick={onUpload}
          isDisabled={isDisabled || !canUse || hasImageAlready}
        >
          Carica
        </Button>
        <Button
          size="sm"
          colorScheme="blue"
          onClick={onPreview}
          isDisabled={!imageId || !hasRemote}
        >
          Anteprima
        </Button>
        <Button
          size="sm"
          colorScheme="red"
          onClick={onDelete}
          isDisabled={!imageId || isDisabled}
        >
          Elimina
        </Button>
      </Flex>

      {previewUrl && (
        <Box mt={3} borderWidth="1px" borderRadius="md" p={2}>
          <Image
            src={previewUrl}
            alt="Question preview"
            maxH="220px"
            objectFit="contain"
          />
        </Box>
      )}
    </Box>
  );
};

export default QuestionImageUploadField;
