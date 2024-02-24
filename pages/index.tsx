import { withAuth, getServerSideProps } from "@/hoc/withAuth";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

interface HomeProps {
  session: Session | null;
}

const Home: React.FC<HomeProps> = ({ session }) => {
  const handleSignOut = async () => {
    //When I redirect via next-auth or next-router withAuth redirect is triggering and it's redirecting to /signup
    await signOut({ callbackUrl: "/signin" });
    window.location.href = "/signin";
  };
  return (
    <>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <button onClick={handleSignOut}>Sign Out</button>
    </>
  );
};

export { getServerSideProps };
export default withAuth(Home);
