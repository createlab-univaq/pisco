import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import FlowEditor from '../../../components/Editor/FlowEditor';
import { APIV2 } from '../../../data/api';
import useStore from '../../../store';
import { PolyglotFlow } from '../../../types/polyglotElements';
import { authOptions } from '../../../utils/authOptions';
import { clearFlowCaches } from '../../../utils/cache';

type FlowIndexProps = {
  accessToken: string | undefined;
};

const FlowIndex = ({ accessToken }: FlowIndexProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Nullable<string>>(null);
  const router = useRouter();
  const flowId = router.query?.id?.toString();

  const toast = useToast();

  const API = useMemo(() => new APIV2(accessToken), [accessToken]);

  const saveFlow = async (outputToast = true, returnPath?: string) => {
    try {
      const storeState = useStore.getState();
      const flow = storeState.getFlow();
      if (!flow) {
        outputToast &&
          toast({
            title: 'Saving error',
            description:
              'Error during saving, the backend could not save correctly, try again.',
            duration: 3000,
            position: 'bottom-left',
            isClosable: true,
          });
        return;
      }

      const response = await API.saveFlowAsync(flow);
      if (response?.status === 200) {
        storeState.setLastSavedAction();
        outputToast &&
          toast({
            title: 'Flow saved',
            description: 'The save was successful',
            status: 'success',
            duration: 3000,
            position: 'bottom-left',
            isClosable: true,
          });
        if (returnPath) router.push(returnPath);
        storeState.updateFlowInfo(response.data);
        clearFlowCaches(response.data._id);
      } else {
        outputToast &&
          toast({
            title: 'Flow not saved',
            description:
              'Something is off with your flow, error: ' +
              response.data.message,
            status: 'warning',
            duration: 3000,
            position: 'bottom-left',
            isClosable: true,
          });
      }
    } catch (err: any) {
      outputToast &&
        toast({
          title: 'Internal Error',
          description: 'Unexpected error, fix it or try again. ' + err.message,
          status: 'error',
          duration: 5000,
          position: 'bottom-left',
          isClosable: true,
        });
    }
  };

  useEffect(() => {
    (async () => {
      // if (!flowId) router.replace("/");
      if (!flowId) return;
      setLoading(true);
      setError(null);
      let flow: Nullable<PolyglotFlow> = null;

      // Get the flow from the server
      try {
        const response = await API.loadFlowElementsAsync(flowId ?? '');
        if (response.status === 200) {
          console.log('flow elements loaded 🆗');
          flow = response.data;
        } else {
          console.error('flow elements not loaded 😢');
          setError('Error loading flow elements');
          if (response.status === 404) {
            setError('Flow not found');
          }
        }
      } catch (error) {
        console.error(error);
        setError('Error loading flow elements');

        if ((error as AxiosError).response?.status === 404) {
          setError('Flow not found');
        }
      }

      // Get the flow stored in the localstorage
      // if stored flow has no unsaved changes, load server's flow
      const flow_serialize = localStorage.getItem('flow');
      if (flow_serialize) {
        const store_flow = JSON.parse(flow_serialize)?.state;
        if (
          store_flow.activeFlowInfo &&
          store_flow.currentAction !== store_flow.lastSavedAction
        ) {
          // if the flow stored has a different uuid i stored as a rescue
          if (store_flow.activeFlowInfo._id !== flowId) {
            try {
              localStorage.setItem(
                'rescue-' + store_flow.activeFlowInfo._id,
                flow_serialize
              );
            } catch (e) {
              console.warn('Rescue non salvato: localStorage pieno', e);
            }

            useStore.persist.clearStorage();
          } else {
            setLoading(false);
            return;
          }
        }
      }

      // handle the rescue flow
      const rescue = localStorage.getItem('rescue-' + flowId);
      if (rescue) {
        localStorage.setItem('flow', rescue);
        localStorage.removeItem('rescue-' + flowId);
        await useStore.persist.rehydrate();
        setLoading(false);
        return;
      }

      // load the server's flow in case other flows are not found
      console.log(flow);
      if (flow) useStore.getState().loadFlow(flow);
      setLoading(false);
    })();
  }, [flowId, setLoading, API]);

  return (
    <>
      {!loading && <FlowEditor mode={'write'} saveFlow={saveFlow} />}

      {/* if is error */}
      <Modal
        isOpen={error !== null}
        onClose={() => console.log('Not closed')}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Error:</ModalHeader>
          <ModalBody>{error}</ModalBody>
          <ModalFooter>
            <Button
              bg={'red.500'}
              color="white"
              _hover={{ bg: 'red.600' }}
              onClick={() => router.reload()}
            >
              Refresh page
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* if is loading */}
      <Modal
        isOpen={loading}
        onClose={() => console.log('Not closed')}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Flex align={'center'}>
              <Spinner size={'xl'} mr={5} />
              <Text fontSize={'xl'} fontWeight="bold">
                Loading flow...
              </Text>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FlowIndex;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session?.idToken) return { props: {} };

  return {
    props: {
      accessToken: session.idToken,
    },
  };
};
