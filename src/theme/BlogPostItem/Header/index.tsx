import React from 'react';
import BlogPostItemHeaderTitle from '@theme/BlogPostItem/Header/Title';
import BlogPostItemHeaderInfo from '@theme/BlogPostItem/Header/Info';
import BlogPostItemHeaderAuthors from '@theme/BlogPostItem/Header/Authors';
import Link from '@docusaurus/Link';

export default function BlogPostItemHeader(): JSX.Element {
    return (
        <header>
            <BlogPostItemHeaderTitle />
            <BlogPostItemHeaderInfo />
        </header>
    );
}
