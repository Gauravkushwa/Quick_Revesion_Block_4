// App.js
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMatches } from "./redux/action";
import MatchList from "./components/MatchList";
import Filters from "./components/Filter";
import Favorites from "./components/Favorite";
import { Box, Heading, SimpleGrid } from "@chakra-ui/react";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMatches());
  }, [dispatch]);

  return (
    <Box p={6}>
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        ⚽ Football Match Tracker
      </Heading>

      <Filters />

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mt={6}>
        <MatchList />
        <Favorites />
      </SimpleGrid>
    </Box>
  );
}

export default App;
