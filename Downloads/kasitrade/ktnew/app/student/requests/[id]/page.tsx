"use client";
import { useRouter } from "next/navigation";
export default function StudentRequestDetailPage() {
  const router = useRouter();
  return (
    <main className="main-content">
      <div className="page-wrap">
        <button className="btn btn-ghost btn-sm" onClick={() => router.push("/student/requests")}>← Back to Requests</button>
      </div>
    </main>
  );
}
