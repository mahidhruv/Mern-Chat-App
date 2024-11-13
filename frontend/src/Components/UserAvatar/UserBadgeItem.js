import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user, handleFunction}) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius={"lg"}
      m={1}
      mb={2}
      variant={"solid"}
      fontSize={12}
      backgroundColor={"#00CED1"}
      color={"white"}
      cursor={"pointer"}
      onClick={handleFunction}
    >
      {user.name}
      <i className="fa-solid fa-xmark" style={{ marginLeft: "8px" }}></i>
    </Box>
  );
}

export default UserBadgeItem