import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 font-[family-name:var(--font-geist-sans)]">
      <div className="flex gap-3 items-stretch flex-col sm:flex-row sm:flex-wrap justify-center">
        <Link
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-[140px]"
          href="/ai-gemini-lite"
        >
          Gemini Lite
        </Link>
        <Link
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-[140px]"
          href="/ai-chatgpt"
        >
          ChatGPT
        </Link>
        <Link
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-[140px]"
          href="/ai-deepseek"
        >
          DeepSeek
        </Link>
      </div>
    </div>
  );
}
