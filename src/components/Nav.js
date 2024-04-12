import { useState } from 'react';
import { Box, Flex, Button, Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Icon, Text } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { PiApertureFill } from "react-icons/pi";

function NavLink(props) {
  const { children } = props;

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      href={'#'}>
      {children}
    </Box>
  );
}

export default function Nav() {
  const [colorMode, setColorMode] = useState('dark');
  

  return (
    <>
      <Box bg={colorMode === 'light' ? 'gray.100' : 'gray.900'} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Flex>
            <Icon as={PiApertureFill} w={10} h={10} color={'white'} />
            <Text fontSize={'2xl'} color={'white'} style={{marginLeft: '.5vw'}}>ufMDB</Text>
          </Flex>

          <Flex alignItems={'center'}>

            

            
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

