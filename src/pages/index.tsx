import Feed from "src/routes/Feed"
import { CONFIG } from "../../site.config"
import { NextPageWithLayout } from "../types"
import { getPosts } from "../apis"
import MetaConfig from "src/components/MetaConfig"
import { queryClient } from "src/libs/react-query"
import { queryKey } from "src/constants/queryKey"
import { GetStaticProps } from "next"
import { dehydrate } from "@tanstack/react-query"
import { filterPosts } from "src/libs/utils/notion"

export const getStaticProps: GetStaticProps = async () => {
  const posts = filterPosts(await getPosts())
  await queryClient.prefetchQuery(queryKey.posts(), () => posts)

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: CONFIG.revalidateTime,
  }
}

const FeedPage: NextPageWithLayout = () => {
  const meta = {
    title: CONFIG.blog.title,
    description: CONFIG.blog.description,
    keywords: CONFIG.blog.keywords,
    type: "website",
    url: CONFIG.link,
    image: `${CONFIG.link}/${CONFIG.blog.ogImage}`,
  }

  return (
    <>
      <MetaConfig {...meta} />
      {/* 隐藏的 H1，优化 SEO */}
      <h1 style={{ display: "none" }}>{CONFIG.blog.title}</h1>
      <Feed />
    </>
  )
}

export default FeedPage
