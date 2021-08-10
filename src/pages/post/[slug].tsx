import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post(): JSX.Element {
  // TODO
  return (
    <>
      <Head>
        <title>spacetravelling</title>
      </Head>
      <Header />
      <main className={styles.container}>
        <img alt="banner" src="/banner.png" className={styles.banner} />
        <section className={styles.post}>
          <h1>Como utilizar hooks</h1>
          <div className={styles.info}>
            <time>
              <FiCalendar className={styles.icon} />
              15 Mar 2021
            </time>
            <p>
              <FiUser className={styles.icon} />
              Joseph Oliveira
            </p>
            <p>
              <FiClock className={styles.icon} /> 4 min
            </p>
          </div>
          <article>
            <h1>Proin et varius</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p>
              {' '}
              Nullam dolor sapien, vulputate eu diam at, condimentum hendrerit
              tellus. Nam facilisis sodales felis, pharetra pharetra lectus
              auctor sed.{' '}
            </p>
          </article>
        </section>
      </main>
    </>
  );
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
