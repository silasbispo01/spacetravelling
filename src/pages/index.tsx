/* eslint-disable jsx-a11y/click-events-have-key-events */
import Link from 'next/link';
import { GetStaticProps } from 'next';

import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';

import Head from 'next/head';
import { useState } from 'react';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import styles from './home.module.scss';
// import commonStyles from '../styles/common.module.scss';

import { getPrismicClient } from '../services/prismic';

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

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const { results, next_page } = postsPagination;
  const [posts, setNewPosts] = useState(results);
  const [nextPage, setNextPage] = useState(next_page);

  async function loadNewPosts(): Promise<void> {
    const data = await fetch(nextPage).then(response => response.json());
    const post = data.results[0];

    if (data.next_page) {
      setNextPage(data.next_page);
    } else {
      setNextPage(null);
    }

    const loadedPosts = {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };

    setNewPosts([...posts, loadedPosts]);
  }
  return (
    <>
      <Head>
        <title>Home | spacetravelling</title>
      </Head>
      <main className={styles.container}>
        <img src="/Logo.svg" alt="logo" />
        <div className={styles.posts}>
          {posts.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a>
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>
                <time>
                  <FiCalendar className={styles.icon} />
                  {format(new Date(post.first_publication_date), 'dd MMM yyy', {
                    locale: ptBR,
                  })}
                </time>
                <div>
                  <FiUser className={styles.icon} />
                  {post.data.author}
                </div>
              </a>
            </Link>
          ))}
        </div>
        <button type="button" onClick={loadNewPosts}>
          {nextPage ? 'Carregar mais posts' : ''}
        </button>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    { pageSize: 1 }
  );

  const { next_page } = postsResponse;
  const results = postsResponse.results.map(post => ({
    uid: post.uid,
    first_publication_date: post.first_publication_date,
    data: {
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
    },
  }));

  const postsPagination = {
    next_page,
    results,
  };

  return {
    props: {
      postsPagination,
    },
  };
};
