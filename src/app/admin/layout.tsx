
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { JumpingDotsLoader } from "@/components/jumping-dots-loader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || userProfile?.role !== 'admin') {
        router.replace('/');
      }
    }
  }, [user, userProfile, loading, router]);

  if (loading || !user || userProfile?.role !== 'admin') {
    return (
      <div className="flex justify-center items-center h-screen">
        <JumpingDotsLoader />
      </div>
    );
  }

  return <>{children}</>;
}
