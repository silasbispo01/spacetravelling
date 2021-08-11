import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
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

export default function Post({ post }: PostProps): JSX.Element {
  const { data } = post;
  // const posts = data.content.map(postI => {
  //   return {
  //     heading: RichText.asText(postI.heading),
  //     body: RichText.asHtml(postI.body),
  //   };
  // });

  console.log(data.content)
  return (
    <>
      <Head>
        <title> | spacetravelling</title>
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
          <article>
            {/* <div dangerouslySetInnerHTML={{ _html: data.content }}> */}
          </article>
        </section>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  // const posts = await prismic.query(
  //   Prismic.Predicates.at('document.type', 'posts')
  // );

  return {
    paths: [{ params: { slug: '/post/mapas-com-react-usando-leaflet' } }],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', slug.toString(), {});

  const content = response.data.content.map(item => RichText.asHtml(item.body));

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
  };
};
