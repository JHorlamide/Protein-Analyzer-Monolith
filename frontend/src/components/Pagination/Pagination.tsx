import { useEffect, useState } from 'react';
import { Box } from "@chakra-ui/react";
import Button from '../CustomBtn/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const [pages, setPages] = useState<number[]>([]);

  const generatePages = () => {
    const pageArray = [];

    for (let i = 1; i <= totalPages; i++) {
      pageArray.push(i);
    }

    setPages(pageArray);
  }

  useEffect(() => {
    generatePages();
  }, [totalPages]);

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <Box position="relative" bottom={{ base: -10, md: -5 }} color="white">
      <Box
        display={{ base: "column", md: "flex" }}
        justifyContent="center"
        alignContent={{ base: "center", md: "start" }}
        alignItems="center" mt={4}
      >
        <Button
          mr={2}
          bg="brand_blue.300"
          isDisabled={currentPage === 1}
          marginBottom={{ base: 5, md: 0 }}
          onClick={() => handlePageChange(currentPage - 1)}
          _hover={{ bg: "brand_blue.300" }}
        >
          Previous
        </Button>

        <Box>
          {pages.map((page) => (
            <Button
              key={page}
              mr={{ base: 1, md: 2 }}
              bg={page === currentPage ? "brand_blue.300" : "blue.100"}
              variant={page === currentPage ? "solid" : "outline"}
              onClick={() => handlePageChange(page)}
              _hover={{ bg: "brand_blue.300" }}
            >
              {page}
            </Button>
          ))}
        </Box>

        <Button
          ml={{ base: 0, md: 2 }}
          bg="brand_blue.300"
          disabled={currentPage === totalPages}
          marginTop={{ base: 5, md: 0 }}
          onClick={() => handlePageChange(currentPage + 1)}
          _hover={{ bg: "brand_blue.300" }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}

export default Pagination