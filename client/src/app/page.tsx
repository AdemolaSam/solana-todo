"use client";

import Header from "@/components/Header";
import TodoList from "@/components/TodoList";
import { useAuth } from "@/providers/AuthProvider";
import { Typography } from "@material-tailwind/react";

export default function HomePage() {
  const { user } = useAuth();
  return (
    <div>
      <Header />
      <main className="p-6">
        {user ? (
          <TodoList />
        ) : (
          <Typography variant="h3" className="font-semibold text-2xl mt-5">
            Sign in with your wallet to view and create tasks
          </Typography>
        )}
      </main>
    </div>
  );
}
