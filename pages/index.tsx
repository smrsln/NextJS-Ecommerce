import { withAuth, getServerSideProps } from "@/hoc/withAuth";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

interface HomeProps {
  session: Session | null;
}

const Home: React.FC<HomeProps> = ({ session }) => {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/signin" });
  };
  return (
    <>
      <div>Home</div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <button onClick={handleSignOut}>Sign Out</button>
    </>
  );
};

export { getServerSideProps };
export default withAuth(Home);
