interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  description: string;
  coverColor: string;
  coverUrl: string;
  isFinished?: boolean;
  isLoaned?: boolean;
}
