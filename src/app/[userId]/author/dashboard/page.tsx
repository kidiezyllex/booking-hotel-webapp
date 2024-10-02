import { getHotelsByUser } from "@/actions/getHotelsByUser";
import Dashboard from "@/components/hotel/Dashboard";

interface PageProps {
  params: { userId: string };
}

export default async function Page({ params }: PageProps) {
  const hotels = await getHotelsByUser(params.userId);
  return (
    <div>
      <Dashboard hotels={hotels} />
    </div>
  );
}
