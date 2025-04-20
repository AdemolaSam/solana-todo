"use client";

import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAuth } from "@/providers/AuthProvider";
import { Button, Chip, Typography } from "@material-tailwind/react";
import Link from "next/link";

const Header = () => {
  const { setVisible } = useWalletModal();
  const wallet = useWallet();
  const { user, login, logout } = useAuth();

  return (
    <header className="py-6 flex justify-between items-center border-b bg-gray-400 px-6">
      <div className="text-lg font-bold">
        <Link href={"/"} className="pr-5">
          📝 Todo Wallet App
        </Link>
        {user ? (
          <Link
            href={"/account"}
            className="bg-white p-2 text-sm md:text-base border rounded-lg cursor-pointer"
          >
            Account
          </Link>
        ) : (
          ""
        )}
      </div>

      <div className="flex gap-4">
        {!wallet.connected ? (
          <Button
            onClick={() => setVisible(true)}
            className="border-2 rounded-lg hover:bg-black hover:text-white p-2 cursor-pointer"
          >
            Connect Wallet
          </Button>
        ) : !user ? (
          <Button
            onClick={login}
            className="border-2 rounded-lg hover:bg-black hover:text-white p-2 cursor-pointer"
          >
            Sign Message
          </Button>
        ) : (
          <>
            <span>{user.walletAddress.slice(0, 8)}...</span>
            <Button
              onClick={logout}
              className="border-2 rounded-lg hover:bg-black hover:text-white p-2 cursor-pointer"
            >
              Logout
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
