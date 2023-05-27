import { Box, Text, Stack, StackDivider, Flex } from '@chakra-ui/react'

const SummaryTable = () => {
  return (
    <Box
      borderRadius="10px"
      bg="brand_blue.100"
      width="full"
      paddingY={4}
    >
      <Stack spacing={3} divider={<StackDivider width="full" height="0.5px" />}>
        <Box paddingX={3} paddingBottom={0.5}>
          <Text fontWeight="semibold">
            Summary table of main metrics
          </Text>
        </Box>

        <Box paddingX={3}>
          <Text>Total number of sequence</Text>
          <Text fontWeight="bold">384</Text>
        </Box>

        <Box paddingX={3}>
          <Text>Number hits</Text>
          <Text fontWeight="bold">60 (15.62%) hit rate</Text>
        </Box>

        <Box paddingX={3}>
          <Text fontWeight="semibold" textAlign="center">Best sequence</Text>
          <Text>Mutations</Text>
          <Flex justifyContent="space-between">
            {["L215F", "R219V", "L249F", "T317F", "T318C", "L349D"].map((item, idx) => (
              <Text fontWeight="bold" key={idx}>{item}</Text>
            ))}
          </Flex>
        </Box>

        <Box paddingX={3}>
          <Text>Fitness score</Text>
          <Text fontWeight="bold">158</Text>
        </Box>
       
        <Box paddingX={3}>
          <Text>Fold improvement over wild type</Text>
          <Text fontWeight="bold">13.6</Text>
        </Box>
      </Stack>
    </Box>
  )
}

export default SummaryTable