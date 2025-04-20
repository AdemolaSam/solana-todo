import { useAuth } from "@/providers/AuthProvider";
import { Card, Typography } from "@material-tailwind/react";
import React from "react";

const UserCard = () => {
  const { user } = useAuth();
  return (
    <div className="w-full mx-auto">
      <Card className="bg-gray-400 flex flex-col gap-5 rounded-tr-2xl rounded-bl-2xl">
        <Typography className="underline text-2xl font-bold text-center">
          ACCOUNT
        </Typography>
        <Typography>Username: {user?.username}</Typography>
        <Typography>Wallet Address: {user?.walletAddress}</Typography>
      </Card>
    </div>
  );
};

export default UserCard;
