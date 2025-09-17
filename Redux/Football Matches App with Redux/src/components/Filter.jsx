import React from "react";
import { useDispatch } from "react-redux";
import { HStack, Input, Select } from "@chakra-ui/react";

export default function Filters() {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch({
      type: "SET_FILTERS",
      payload: { [e.target.name]: e.target.value },
    });
  };

  return (
    <HStack spacing={4} wrap="wrap" mb={6}>
      <Input
        placeholder="Search matches..."
        name="searchQuery"
        onChange={handleChange}
        width="200px"
      />
      <Input
        placeholder="Filter by team"
        name="team"
        onChange={handleChange}
        width="200px"
      />
      <Input type="date" name="date" onChange={handleChange} width="200px" />
      <Select name="outcome" onChange={handleChange} width="200px">
        <option value="">All</option>
        <option value="team1">Team1 Win</option>
        <option value="team2">Team2 Win</option>
        <option value="draw">Draw</option>
      </Select>
    </HStack>
  );
}
