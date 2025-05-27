// --- app/chat/[gptId]/page.tsx ---
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

interface ChatPageProps {
  params: { gptId: string };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) return <div className="p-4 text-red-600">You must be signed in.</div>;

  const gpt = await prisma.gPT.findUnique({
    where: { id: params.gptId },
    include: { createdBy: true },
  });

  if (!gpt || gpt.createdBy.email !== session.user.email) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">{gpt.name}</h1>
      <p className="text-gray-600 mb-6">{gpt.description}</p>

      {/* Placeholder for chat UI */}
      <div className="border rounded p-4 bg-gray-50">
        <p className="text-sm italic text-gray-500">Chat functionality coming soon...</p>
      </div>
    </div>
  );
}
