"use client";

import { useState, FormEvent } from "react";
import BookList from "@/components/BookList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBook } from "@/lib/actions/book";

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
      console.log(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSearch} className="search">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nom du livre"
          className="search-input"
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
