import React, { useState } from "react";
import axios from "axios";
import { Box, FormControl, FormLabel, Input, Button, Select } from "@chakra-ui/react";

const TodoInput = ({ setTodos, todos }) => {
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [completionDateTime, setCompletionDateTime] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const newTodoObj = {
        title: title,
        assignedTo: assignedTo,
        completionDateTime: completionDateTime,
        status: "Pending",
      };

      const res = await axios.post(`http://localhost:8080/todos`, newTodoObj); // Updated endpoint URL
      setTodos([...todos, res.data]);

      // Clear input fields after successful submission
      setTitle("");
      setAssignedTo("");
      setCompletionDateTime("");
    } catch (error) {
      console.log("Error:", error);
    }
  }

  return (
    <Box style={{ border: "1px solid black", width: "60%", margin: "auto" }}>
      <form style={{ margin: "auto" }} onSubmit={handleSubmit}>
        <FormControl w="20%">
          <FormLabel>Title</FormLabel>
          <Input
            type="text"
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>

        <FormControl w="20%">
          <FormLabel>Assigned To</FormLabel>
          <Select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option value="john">john</option>
            <option value="rita">rita</option>
            <option value="bharti">bharti</option>
            <option value="deepak">deepak</option>
          </Select>
        </FormControl>

        <FormControl w="20%">
          <FormLabel>Completion Date & Time:</FormLabel>
          <Input
            type="datetime-local"
            required
            value={completionDateTime}
            onChange={(e) => setCompletionDateTime(e.target.value)}
          />
        </FormControl>

        <Button type="submit">Add Todo</Button>
      </form>
    </Box>
  );
};

export default TodoInput;
