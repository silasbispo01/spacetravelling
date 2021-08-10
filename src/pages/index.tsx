import Link from 'next/link';
import { GetStaticProps } from 'next';
import { FiCalendar, FiUser } from 'react-icons/fi';
import styles from './home.module.scss';
import { getPrismicClient } from '../services/prismic';
import Prismic from 'prismicio/client'
import commonStyles from '../styles/common.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(): JSX.Element {
  // TODO
  return (
    <>
      <main className={styles.container}>
        <img src="/Logo.svg" alt="Logo" />
        <div className={styles.posts}>
          <Link href="/post/Como-utilizar-hooks">
            <a>
              <h1>Como utilizar hooks</h1>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <time>
                <FiCalendar className={styles.icon} />
                15 Mar 2021
              </time>
              <div>
                <FiUser className={styles.icon} />
                Joseph Oliveira
              </div>
            </a>
          </Link>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts'),
  ]);

  // const posts = {
  //   slug,
  //   title,
  //   subtitle,
  //   published_at,
  //   author,
  // }

  return {
    props: {
      post: 'oi',
    },
  };
};
