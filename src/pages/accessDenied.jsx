import { Button, Link } from "@nextui-org/react";

export default function AccessDenied() {
  return (
    <div id="error-page" className="flex items-center flex-col h-screen justify-center">
      <h1 className="text-3xl font-bold mb-10">Oops!</h1>
      <p className="text-xl font-normal mb-8">Maaf, Akses untuk halaman yang Anda tuju ditolak</p>

      <Link href="/">
        <Button variant="ghost">Kembali</Button>
      </Link>
    </div>
  );
}
