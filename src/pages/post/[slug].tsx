import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';

import { useRouter } from 'next/router';
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
  const { data } = post;

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
              {post.first_publication_date}
            </time>
            <p>
              <FiUser className={styles.icon} />
              {data.author}
            </p>
            <p>
              <FiClock className={styles.icon} /> 4 min
            </p>
          </div>
          {data.content.map(richtext => (
            <article key={richtext.heading}>
              <h1>{richtext.heading}</h1>
              <div dangerouslySetInnerHTML={{ __html: richtext.body.text }} />
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

  const content = response.data.content.map(item => ({
    heading: item.heading,
    body: {
      text: RichText.asHtml(item.body),
    },
  }));

  const post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      'ee MMM yyy',
      {
        locale: ptBR,
      }
    ),
    data: {
      title: RichText.asText(response.data.title),
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content,
    },
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 60, // 1 hour
  };
};
