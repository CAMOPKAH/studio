"use client";

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      <p className="mt-4 text-xl text-foreground">Загрузка...</p>
    </div>
  );
}
