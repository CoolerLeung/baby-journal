export type TimelineMemoryCard =
  | {
      id: string;
      variant: 'featured';
      category: string;
      date: string;
      title: string;
      description: string;
      image: string;
      likes: number;
      comments: number;
    }
  | {
      id: string;
      variant: 'standard';
      category: string;
      date: string;
      title: string;
      description: string;
      image: string;
    }
  | {
      id: string;
      variant: 'quote';
      quote: string;
      description: string;
      date: string;
    }
  | {
      id: string;
      variant: 'portrait';
      category: string;
      date: string;
      title: string;
      description: string;
      image: string;
    }
  | {
      id: string;
      variant: 'overlay';
      title: string;
      date: string;
      image: string;
      alt: string;
    };

export type TimelineMonth = {
  month: string;
  year: string;
  cards: TimelineMemoryCard[];
};

export type MemoryDetail = {
  id: string;
  breadcrumbLabel: string;
  title: string;
  dateLabel: string;
  author: string;
  time: string;
  location: string;
  camera: string;
  audioTitle: string;
  body: string[];
  tags: string[];
  previousLabel: string;
  nextLabel: string;
  mainImage: string;
  galleryImages: string[];
};
