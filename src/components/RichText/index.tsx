import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'

import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { cn } from '@/utilities/ui'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps>

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const doc = linkNode.fields.doc
  if (!doc) return '#'

  const { value, relationTo } = doc

  // value peut être un ID (number/string) si la depth n'est pas suffisante
  if (!value || typeof value !== 'object') return '#'

  const slug = (value as any).slug
  if (!slug) return '#'

  if (relationTo === 'posts') return `/blogue/${slug}`

  return `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  blocks: {
    banner: ({ node }) => <BannerBlock className="col-start-2 mb-8" {...node.fields} />,
    mediaBlock: ({ node }) => (
      <MediaBlock
        className="col-start-1 col-span-3 my-10"
        imgClassName="m-0 rounded-2xl"
        {...node.fields}
        captionClassName="mx-auto mt-3 max-w-[48rem] text-sm text-neutral-500"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    code: ({ node }) => <CodeBlock className="col-start-2 my-8" {...node.fields} />,
    cta: ({ node }) => <CallToActionBlock {...node.fields} />,
  },
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props

  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        enableGutter && 'container',
        !enableGutter && 'max-w-none',
        enableProse &&
          [
            'mx-auto prose md:prose-md lg:prose-lg',
            'max-w-[74ch]',
            'prose-p:leading-8 prose-p:text-neutral-700',
            'prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-neutral-950',
            'prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-3xl',
            'prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-2xl',
            'prose-h4:mt-6 prose-h4:mb-2 prose-h4:text-xl',
            'prose-strong:font-semibold prose-strong:text-neutral-950',
            'prose-a:font-medium prose-a:text-red-600 prose-a:no-underline',
            '[&_a:hover]:text-red-800 [&_a:active]:text-red-400',
            'prose-ul:my-6 prose-ol:my-6',
            'prose-li:my-2 prose-li:leading-7',
            'prose-hr:my-10',
            'prose-blockquote:border-l-red-700 prose-blockquote:text-neutral-700',
          ],
        className,
      )}
      {...rest}
    />
  )
}