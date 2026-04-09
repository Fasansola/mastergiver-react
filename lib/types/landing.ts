import { StaticImageData } from 'next/image';

export interface triElementBox {
  image?: string | StaticImageData;
  title: string;
  description: string;
  price?: string;
}

export interface CheckProps {
  item: string;
}
