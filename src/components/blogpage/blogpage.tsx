import { groq } from "next-sanity";
import { PortableText, toPlainText } from "@portabletext/react";
import { RichTextComponent } from "@/components/richtext/richtext.component";
import SanityImage from "@/components/image/sanityimage";
import Link from "next/link";
import TableOfContents from "@/components/tableofcontent/tableofcontent";
import BlogCard from "@/components/card/card.blog";

export default function BlogPage({ post, suggestions }: { post: Post; suggestions: Post[] }) {
  return (
    <div className="w-screen flex flex-col items-center justify-center pb-14 sm:pb-7">
      <article className="w-full max-w-[1200px] flex flex-col gap-8 justify-center items-center">
        <section className="px-7 flex flex-col gap-4 justify-center">
          <div className="break-words px-20 text-center font-heading text-5xl font-bold text-slate-900 md:px-4 md:text-3xl lg:px-5 xl:px-8 xl:text-4xl">
            <h1 className="leading-snug" data-query="post-title">
              {post.title}
            </h1>
          </div>
          <h2 className="text-3xl leading-snug text-slate-700 md:text-2xl text-center">
            {post.description}
          </h2>
          <div className="flex justify-center items-center text-xs font-medium gap-4 mt-4 sm:mt-2">
            {post?.categories.map((category: Category, i: number) => {
              return (
                <div
                  key={i}
                  className="rounded-full px-3 py-1 font-semibold text-sm sm:text-xs"
                  style={{
                    color: category.color.hex,
                    border: `2px solid ${category.color.hex}`,
                  }}
                >
                  {category.title}
                </div>
              );
            })}
          </div>
          <div className="flex justify-center items-center gap-2 sm:flex-col">
            <Link
              className="flex justify-center items-center gap-2"
              href="https://adnansh.in"
              target="_blank"
            >
              <div className="relative flex justify-center items-center gap-4 w-12 h-12 rounded-full overflow-hidden sm:w-10 sm:h-10">
                <SanityImage
                  className="object-cover object-top"
                  src={post.author.image}
                  alt={post.author.name}
                />
              </div>
              <p className="font-semibold text-slate-900">{post.author.name}</p>
            </Link>
            <span className="block font-bold text-slate-500 sm:hidden">·</span>
            <time className="text-gray-500">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </section>
        <section className="px-7 mt-5 relative w-full aspect-video sm:w-screen sm:px-0 rounded-lg lg:rounded-none overflow-hidden">
          <SanityImage
            className="object-cover object-center"
            src={post.mainImage}
            alt={post.title}
          />
        </section>
        <section className="w-full md:px-4 flex justify-center">
          <div className="px-7 mt-10 w-full text-xl font-medium flex flex-col gap-2 max-w-[800px] overflow-hidden rounded-2xl border border-slate-300 p-6">
            <TableOfContents headings={post.headings} />
          </div>
        </section>
        <section
          className="px-7 w-full text-xl font-medium flex flex-col gap-5 max-w-[800px]"
          style={{ lineHeight: "1.8" }}
        >
          <PortableText value={post.body as any} components={RichTextComponent} />
        </section>
        <section className="px-7 w-full mt-5 mb-5 border-t border-b py-10 max-w-[800px]">
          <div className="flex w-full flex-row items-start gap-5 md:gap-2">
            <div className="">
              <Link
                href="https://adnansh.in"
                target="_blank"
                className="relative block h-24 w-24 overflow-hidden rounded-full border md:h-20 md:w-20"
              >
                <SanityImage
                  className="object-cover object-top"
                  src={post.author.image}
                  alt={post.author.name}
                />
              </Link>
            </div>
            <div className="flex-1">
              <div className="flex flex-row flex-nowrap items-start md:flex-wrap">
                <div className="flex-1 w-auto md:w-full md:block">
                  <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-slate-500 ">
                    Written by
                  </h3>
                  <h1 className="mb-5 font-heading text-2xl font-bold text-black  md:mb-2">
                    <Link href="https://adnansh.in" target="_blank">
                      {post.author.name}
                    </Link>
                  </h1>
                </div>
              </div>
              <div className="break-words text-slate-600">
                <p>{toPlainText(post.author.bio)}</p>
              </div>
            </div>
          </div>
        </section>
      </article>
      <div className="w-full max-w-[1200px] flex flex-col gap-4 justify-center items-center pt-16 md:pt-10">
        <h1 className="text-2xl font-bold text-slate-900">More Articles</h1>
        <p className="text-lg font-medium text-slate-700">
          You might also like these articles from my blog
        </p>
      </div>
      <div className="px-7 w-full max-w-[1200px] grid grid-cols-3 justify-items-center items-stretch gap-6 pt-5 pb-28 lg:grid-cols-2 sm:grid-cols-1 md:items-center">
        {suggestions &&
          suggestions.map((post: Post, i: number) => {
            return <BlogCard key={i} post={post} />;
          })}
      </div>
    </div>
  );
}

export const query = groq`
  {
    "post": *[_type == "post" && slug.current == $slug] {
      ...,
      author->,
      categories[]->,
      "headings": body[length(style) == 2 && string::startsWith(style, "h")],
    } [0],
    "suggestions": *[_type == "post" && slug.current != $slug] {
      ...,
      categories[]->,
    } | order(_createdAt desc) [0...8]
  }
`;

export const metaQuery = groq`
  {
    "post": *[_type == "post" && slug.current == $slug] {
      mainImage,
      author->,
      title,
      slug,
      description,
      categories->,
    } [0]
  }
`;
