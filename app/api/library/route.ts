import { getDominantColorFromImage } from "@/lib/utils";

interface Book {
  title?: string;
  author_name?: string[];
  language?: string[];
  first_publish_year?: number;
  [key: string]: any;
  cover_i?: string;
}

export const getBook = async (query: string): Promise<Book[]> => {
  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&language=fre`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { docs: Book[] } = await response.json();

    const frenchBooks: Pick<
      Book,
      "title" | "author_name" | "first_publish_year" | "cover_i"
    >[] = data.docs
      .filter((book) => book.language?.includes("fre"))
      .map(({ title, author_name, first_publish_year, cover_i }) => ({
        title,
        author_name,
        first_publish_year,
        cover_i,
      }));

    console.log(frenchBooks);
    return frenchBooks;
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};

export const getCover = async (cover_i: number) => {
  const imageUrl = `https://covers.openlibrary.org/b/ID/${cover_i}-L.jpg`;

  try {
    const coverColor = await getDominantColorFromImage(imageUrl);
    return { coverImage: imageUrl, coverColor };
  } catch (error) {
    console.error("Error extracting color:", error);
    return { coverImage: imageUrl, coverColor: "#012B48" };
  }
};
