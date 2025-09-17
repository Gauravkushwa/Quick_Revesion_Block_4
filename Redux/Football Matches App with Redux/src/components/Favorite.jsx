import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Text, Button, VStack } from "@chakra-ui/react";

export default function Favorites() {
  const { favorites } = useSelector((state) => state.favorites);
  const dispatch = useDispatch();

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        ⭐ Favorites
      </Text>
      <VStack spacing={4} align="stretch">
        {favorites.length === 0 ? (
          <Text>No favorites yet</Text>
        ) : (
          favorites.map((fav) => (
            <Box key={fav.id} p={4} borderWidth="1px" borderRadius="lg" shadow="md">
              <Text>
                {fav.team1} vs {fav.team2}
              </Text>
              <Button
                colorScheme="red"
                size="sm"
                mt={2}
                onClick={() =>
                  dispatch({ type: "REMOVE_FAVORITE", payload: fav.id })
                }
              >
                Remove
              </Button>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
}
