import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default async function PrivacyPolicyPage() {
    const filePath = path.join(process.cwd(), 'src/content/privacy-policy.md');
    const content = fs.readFileSync(filePath, 'utf8');

    return (
        <div className="min-h-screen flex flex-col font-sans text-text-main bg-base-50 selection:bg-secondary-200 selection:text-primary-800">
            {/* Header (Simplified) */}
            <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-white/50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="relative w-8 h-8 overflow-hidden rounded-lg">
                            <Image src="/logo.png" alt="Logo" fill className="object-cover" />
                        </div>
                        <span className="font-serif font-medium text-primary-600">CP-SUP</span>
                    </Link>
                    <Link href="/" className="text-sm font-medium text-text-muted hover:text-primary-600 transition-colors">
                        トップへ戻る
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 pt-32 pb-24 px-6">
                <article className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-secondary-100">
                    <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-text-main prose-p:text-text-main prose-strong:text-text-main prose-ul:text-text-main">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-8 border-b pb-4 border-secondary-200" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-12 mb-6" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-8 mb-4" {...props} />,
                                p: ({ node, ...props }) => <p className="leading-relaxed mb-6" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2" {...props} />,
                                li: ({ node, ...props }) => <li className="" {...props} />,
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                </article>
            </main>

            {/* Footer (Simplified) */}
            <footer className="bg-text-main text-secondary-50 py-8 px-6 text-center text-sm">
                <p className="text-secondary-400 font-light tracking-wider mb-2">
                    © 2025 enfance / Clinical Psychologist Support
                </p>
            </footer>
        </div>
    );
}
