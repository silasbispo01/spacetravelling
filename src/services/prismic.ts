import Prismic from '@prismicio/client';
import { DefaultClient } from '@prismicio/client/types/client';

export function getPrismicClient(req?: unknown): DefaultClient {
  const prismicEndPoint = process.env.PRISMIC_API_ENDPOINT;
  const prismic = Prismic.client(prismicEndPoint, {
    req,
  });
  return prismic;
}
