"use client";

import { getBook } from "@/app/api/library/route";
import BookList from "@/components/BookList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, FormEvent } from "react";

const Page: React.FC = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);

  const handleSearch = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!query.trim()) {
      console.log("Please enter a valid query.");
      return;
    }

    setBooks([]);
    try {
      const data = await getBook(query);
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSearch}>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nom du livre"
          className="mb-4 text-white"
        />
        <Button type="submit" disabled={!query.trim()}>
          Chercher
        </Button>
      </form>

      <div>
        <BookList title="" books={books} containerClassName="mt-28" />
      </div>
    </>
  );
};

export default Page;
