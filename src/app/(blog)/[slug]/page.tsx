import { draftMode } from "next/headers";
import { Metadata } from "next";
import { LiveQuery } from "next-sanity/preview/live-query";
import { sanityFetch } from "@/../lib/sanity.fetch";
import BlogPage, { query, metaQuery } from "@/components/blogpage/blogpage";
import { client } from "@/../lib/sanity.client";
import { groq } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { revalidate as rv } from "@/constants";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

interface resp {
  post: Post;
  suggestions?: Post[];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const builder = imageUrlBuilder(client);
  const post = (await sanityFetch<resp>({ query: metaQuery, params: params }))?.post;
  if (!post) return null;
  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author.name, url: builder.image(post.author.image).url() }],
    keywords: post.categories?.map((category) => {
      return category.title;
    }),
    openGraph: {
      title: post.title,
      description: post.description,
      images: [builder.image(post.mainImage).url()],
    },
  };
}

export async function generateStaticParams() {
  const posts = (
    await client.fetch(getParamQuery, {
      next: {
        revalidate: rv,
      },
    })
  ).posts as Post[];
  return posts?.map((post) => ({
    slug: post.slug.current,
  }));
}

export default async function Page({ params }: Props) {
  const data = await sanityFetch<resp>({ query, params: params });
  if (data?.post == null) {
    notFound();
  }
  return (
    <LiveQuery enabled={draftMode().isEnabled} query={query} initialData={{}} as={BlogPage}>
      <BlogPage post={data?.post} suggestions={data?.suggestions} />
    </LiveQuery>
  );
}

const getParamQuery = groq`
  {
    "posts": *[_type == "post"] {
      slug,
    }
  }
`;
