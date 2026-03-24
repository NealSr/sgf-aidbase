import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-12 py-32 px-16 bg-white dark:bg-black">
        <div className="flex items-center gap-8">
          <Image
            src="/ctrl_aid_team_logo.svg"
            alt="Ctrl+Aid Team logo"
            width={150}
            height={150}
            priority
          />
          <Image
            src="/sgf_aidbase_logo.svg"
            alt="SGF AidBase logo"
            width={150}
            height={150}
            priority
          />
        </div>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Placeholder for SGF AidBase
        </p>
      </main>
    </div>
  );
}
