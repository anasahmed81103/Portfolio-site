import type { ReactNode } from 'react';

type ArticleProps = {
  children: ReactNode;
  className?: string;
  headline?: string;
  dek?: string;
  byline?: string;
  dropCap?: boolean;
  as?: 'article' | 'div' | 'section';
};

function Article({
  children,
  className = '',
  headline,
  dek,
  byline,
  dropCap = false,
  as: Tag = 'article',
}: ArticleProps) {
  return (
    <Tag className={`np-article ${dropCap ? 'np-article-dropcap' : ''} ${className}`.trim()}>
      {headline ? <h2 className="np-headline">{headline}</h2> : null}
      {dek ? <p className="np-dek">{dek}</p> : null}
      {byline ? <p className="np-byline">{byline}</p> : null}
      <div className="np-article-body">{children}</div>
    </Tag>
  );
}

export default Article;
