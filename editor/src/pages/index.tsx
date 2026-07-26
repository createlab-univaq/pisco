import { Button, Center, Heading, Stack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Navbar from '../components/NavBars/NavBar';

const Home = () => {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <>
      <Navbar user={user} />
      <Center h="92vh">
        <Stack align="center">
          <Heading as="b" fontSize="3xl">
            Go to Flow
          </Heading>
          <Link href={'/flows'} style={{ textDecoration: 'none' }}>
            <Button colorScheme={'blue'}>Enter</Button>
          </Link>
        </Stack>
      </Center>
    </>
  );
};

export default Home;
