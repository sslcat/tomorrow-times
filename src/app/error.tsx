'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <div className="empty-state"><h1>The edition couldn’t be loaded.</h1><p>Your saved reading list is still in this browser. Please try again.</p><button className="button" onClick={reset}>Try again</button></div>;}
