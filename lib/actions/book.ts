"use server";

import { db } from "@/database/drizzle";
import { books } from "@/database/schema";

interface Book {
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

export const getBook = async (
  query: string
): Promise<
  {
    title: string;
    author: string;
    year: number;
    coverUrl: string;
  }[]
> => {
  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { docs: Book[] } = await response.json();

    const booksWithDetails = data.docs.map((book) => {
      const title = book.title || "Unknown Title";
      const author = book.author_name ? book.author_name[0] : "Unknown Author";
      const year = book.first_publish_year || 0;
      const coverUrl = book.cover_i
        ? `https://covers.openlibrary.org/b/ID/${book.cover_i}-L.jpg`
        : "https://placehold.co/400x600.png";

      return { title, author, year, coverUrl };
    });

    return booksWithDetails;
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};

export const createBook = async (params: BookParams) => {
  try {
    const newBook = await db
      .insert(books)
      .values({
        ...params,
      })
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook[0])),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occurred while creeating book",
    };
  }
};
