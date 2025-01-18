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

    // Transformation des données
    const booksWithDetails = data.docs.map((book) => {
      const title = book.title?.toLowerCase().trim() || "Unknown Title"; // Normalisation des titres
      const author =
        book.author_name?.[0]?.toLowerCase().trim() || "Unknown Author"; // Normalisation des auteurs
      const year = book.first_publish_year || 0;
      const coverUrl = book.cover_i
        ? `https://covers.openlibrary.org/b/ID/${book.cover_i}-L.jpg`
        : "https://placehold.co/400x600.png";

      return { title, author, year, coverUrl };
    });

    // Filtrage pour éliminer les doublons
    const uniqueBooks = Object.values(
      booksWithDetails.reduce(
        (acc, book) => {
          const normalizedTitle = book.title
            .replace(/[^a-z0-9\s]/gi, "") // Supprime caractères spéciaux
            .replace(/\s+/g, " ") // Réduit espaces multiples
            .trim();
          const key = `${normalizedTitle}|${book.author}`; // Clé normalisée

          if (!acc[key] || book.year > acc[key].year) {
            // Conserver si l'entrée est nouvelle ou plus récente
            acc[key] = book;
          }

          return acc;
        },
        {} as Record<
          string,
          { title: string; author: string; year: number; coverUrl: string }
        >
      )
    );

    return uniqueBooks;
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
