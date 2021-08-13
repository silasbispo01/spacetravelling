/* eslint-disable react/no-danger */
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';

import { useRouter } from 'next/router';
import { Reducer } from 'react';
import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';
// import commonStyles from '../../styles/common.module.scss';

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

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();
  const { data, first_publication_date } = post;

  // calculo do tempo de leitura
  const readTime = data.content.reduce((readTimeAc: number, i) => {
    const timeWBM = 200;
    let numberOfWords = 0;

    numberOfWords =
      i.heading.split(' ').length + RichText.asText(i.body).split(' ').length;

    // eslint-disable-next-line no-param-reassign, no-return-assign
    return (readTimeAc += Math.ceil(numberOfWords / timeWBM));
  }, 0);

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Head>
        <title>{data.title} | spacetravelling</title>
      </Head>
      <Header />
      <main className={styles.container}>
        <img alt="banner" src={data.banner.url} className={styles.banner} />
        <section className={styles.post}>
          <h1>{data.title}</h1>
          <div className={styles.info}>
            <time>
              <FiCalendar className={styles.icon} />
              {format(new Date(first_publication_date), 'dd MMM yyy', {
                locale: ptBR,
              })}
            </time>
            <p>
              <FiUser className={styles.icon} />
              {data.author}
            </p>
            <p>
              <FiClock className={styles.icon} />
              {readTime} min
            </p>
          </div>
          {data.content.map(content => (
            <article key={content.heading}>
              <h1>{content.heading}</h1>
              <div
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(content.body),
                }}
              />
            </article>
          ))}
        </section>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts')
  );

  const slug = posts.results.map(post => String(post.uid));

  const paths = slug.map(slugPath => ({
    params: { slug: slugPath },
  }));
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(content => ({
        heading: content.heading,
        body: [...content.body],
      })),
    },
  };

  return {
    props: {
      post,
    },
    // revalidate: 60 * 60, // 1 hour
  };
};
