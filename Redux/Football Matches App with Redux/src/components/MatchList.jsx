import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Text, Button, VStack, Spinner } from "@chakra-ui/react";

export default function MatchList() {
  const { footballMatches, isLoading, isError } = useSelector(
    (state) => state.matches
  );
  const filters = useSelector((state) => state.filters);
  const dispatch = useDispatch();

  if (isLoading) return <Spinner size="xl" color="blue.500" />;
  if (isError) return <Text color="red.500">Error loading matches.</Text>;

  // Filtering logic
  const filteredMatches = footballMatches.filter((match) => {
    return (
      (filters.searchQuery === "" ||
        match.team1.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        match.team2.toLowerCase().includes(filters.searchQuery.toLowerCase())) &&
      (filters.team === "" ||
        match.team1 === filters.team ||
        match.team2 === filters.team) &&
      (filters.date === "" || match.date === filters.date) &&
      (filters.outcome === "" || match.winner === filters.outcome)
    );
  });

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        All Matches
      </Text>
      <VStack spacing={4} align="stretch">
        {filteredMatches.map((match) => (
          <Box key={match.id} p={4} borderWidth="1px" borderRadius="lg" shadow="md">
            <Text fontWeight="semibold">
              {match.team1} vs {match.team2}
            </Text>
            <Text>Venue: {match.venue}</Text>
            <Text>Date: {match.date}</Text>
            <Button
              colorScheme="blue"
              size="sm"
              mt={2}
              onClick={() => dispatch({ type: "ADD_FAVORITE", payload: match })}
            >
              Add to Favorites
            </Button>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
