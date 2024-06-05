import { useRouteError } from "react-router-dom";
import { Button } from "@nextui-org/react";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  const handleBackButton = () => {
    window.history.back();
  };

  return (
    <div id="error-page" className="flex items-center flex-col h-screen justify-center">
      <h1 className="text-3xl font-bold mb-10">Oops!</h1>
      <p className="text-xl font-normal mb-8">Sorry, an unexpected error has occurred.</p>
      <p className="mb-10">
        {error ? (
          <i>{error.statusText || error.message}</i>
        ) : (
          <p className="mb-10">
            <i>Page Not Found</i>
          </p>
        )}
      </p>
      <Button color="default" variant="ghost" onClick={handleBackButton}>
        Kembali
      </Button>
    </div>
  );
}
