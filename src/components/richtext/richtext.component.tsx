import Image from "next/image";
import urlFor from "../../../lib/sanity.urlfor";
import Link from "next/link";
import { PortableTextComponents } from "@portabletext/react";
import slugify from "../slugify/slugify";

export const RichTextComponent: PortableTextComponents = {
  types: {
    image: ({ value, isInline }) => {
      return (
        <div className="relative w-full h-96 mt-10 mx-auto">
          <Image className="object-contain" src={urlFor(value).url()} fill alt="Blog Post Image" />
        </div>
      );
    },
  },
  list: {
    bullet: ({ children }) => {
      return (
        <ul className="list-disc ml-10 sm:ml-6 space-y-1" style={{ lineHeight: "1.6" }}>
          {children}
        </ul>
      );
    },
    number: ({ children }) => {
      return <ol className="mt-lg ml-10 sm:ml-6 list-decimal">{children}</ol>;
    },
    nospace: ({ children }) => {
      return <div className="mt-lg flex flex-col list-none">{children}</div>;
    },
  },
  block: {
    h1: ({ children }: any) => {
      return (
        <h1 className="text-5xl pt-10 font-bold" id={slugify(children[0])}>
          {children}
        </h1>
      );
    },
    h2: ({ children }: any) => {
      return (
        <h2 className="text-4xl pt-10 font-bold" id={slugify(children[0])}>
          {children}
        </h2>
      );
    },
    h3: ({ children }: any) => {
      return (
        <h3 className="text-3xl pt-10 font-bold" id={slugify(children[0])}>
          {children}
        </h3>
      );
    },
    h4: ({ children }: any) => {
      return (
        <h4 className="text-2xl pt-10 font-bold" id={slugify(children[0])}>
          {children}
        </h4>
      );
    },
    blockquote: ({ children }) => {
      return (
        <blockquote className="border-l-[#3DED97] border-l-4 pl-5 py-5 my-5">{children}</blockquote>
      );
    },
  },
  marks: {
    link: ({ children, value }: any) => {
      const target = (value?.href || "").startsWith("http") ? "_blank" : undefined;
      return (
        <Link
          href={value?.href}
          target={target}
          rel={target === "_blank" && "noindex nofollow"}
          className="underline text-blue-700 hover:text-blue-500"
        >
          {children}
        </Link>
      );
    },
  },
};
